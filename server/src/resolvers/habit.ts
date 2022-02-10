import { ReqResContext } from "../types/ReqResContext";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Habit } from "../entities/Habit";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";

@InputType()
class HabitInput {
  @Field()
  habitDay: string;
  @Field()
  habitName: string;
  @Field()
  habitStart?: string;
  @Field()
  habitEnd?: string;
  @Field()
  allDay: boolean;
  @Field()
  bgColor: string;
}

/** 습관 인풋 검증 */
const validateHabitInput = async (userId: number, habitInput: HabitInput) => {
  let { habitDay, habitName, allDay, habitStart, habitEnd } = habitInput;

  // 1. habitDay
  if (habitDay == "0000000" || habitDay.length != 7)
    throw new Error("올바른 요일을 선택하세요");
  // 입력은 0010000이런식으로 수가 들어와야 함
  if (Number.isNaN(Number(habitDay)))
    throw new Error("올바른 요일을 입력하세요");
  // 2. habitName
  if (!habitName) throw new Error("습관명을 입력하세요");
  // 3. allDay
  if (allDay) {
    // 해당 요일에 종일습관이 6개 이하인지 확인하기
    const allDayHabits = await Habit.find({ userId });
    let dailyAllDayHabits = [0, 0, 0, 0, 0, 0, 0];
    allDayHabits.forEach((value) => {
      for (let i = 0; i < value.habitDay.length; i++) {
        // EX) habitDay = "0010001"
        if (value.allDay) dailyAllDayHabits[i] += Number(value.habitDay[i]);
      }
    });
    if (Math.max(...dailyAllDayHabits) >= 6)
      throw new Error("해당 요일에 이미 종일습관이 6개 존재합니다");
    habitInput.habitStart = "00:00";
    habitInput.habitEnd = "00:00";
  } else {
    // 4. habitStart, habitEnd 있는지 + 겹치는 시간대가 있는지 확인
    if (!habitStart || !habitEnd) throw new Error("습관 시간을 입력하세요");
  }
  return habitInput;
};

@Resolver(Habit)
export class HabitResolver {
  /** 습관 체크(완료) */
  @Mutation(() => Habit, { nullable: true })
  @UseMiddleware(isAuth)
  async checkHabit(
    @Arg("habitId", () => Int) habitId: number,
    @Ctx() { req }: ReqResContext
  ): Promise<Habit | null> {
    const { userId } = req.session;
    if (!userId) return null;

    const habit = await Habit.findOne({ id: habitId, userId });
    if (!habit) return null;

    // 습관 체크 확인 위한 날짜 정의
    let checked = habit.checked.slice(0, 12);
    let now = new Date();
    // getDay에서 Sunday = 0, 이후 1~6까지가 월~토
    let dayList = ["일", "월", "화", "수", "목", "금", "토"];
    let year = now.getFullYear();
    let month =
      now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
    let date = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
    let getDay = now.getDay();
    let day = dayList[getDay];
    let today = `${year}-${month}-${date}-${day}`;

    // 1. 이미 완료했는지 확인
    if (today === checked)
      throw new Error("이미 완료되었거나 지금 완료할 수 없는 습관입니다.");
    // 2. 오늘 완료할 수 있는 습관인지 확인
    if (habit.habitDay[getDay - 1] !== "1")
      throw new Error("오늘 완료할 수 있는 습관이 아닙니다");
    // 3. 종일이 아니라면, 시간도 체크하기, 종료시간으로부터 +-20분 이내에만 완료 체크를 할 수 있음,
    if (!habit.allDay) {
      let hour = now.getHours();
      let minute = now.getMinutes();
      let endTime = habit.habitEnd.split(":").map(Number); //0=hour, 1=min
      let checkStart =
        endTime[1] - 20 > 0
          ? [endTime[0], endTime[1] - 20]
          : [endTime[0] - 1, 40];
      let checkEnd = [endTime[0], endTime[1] + 20];

      // 1. 체크 가능 시간이 다른 경우
      if (checkStart[0] != checkEnd[0]) {
        if (
          (hour == checkStart[0] && minute < checkStart[1]) ||
          hour < checkStart[0] ||
          (hour == checkEnd[0] && minute > checkEnd[1]) ||
          hour > checkEnd[0]
        ) {
          throw new Error(
            "완료 체크할 수 없는 습관입니다.\n지정한 완료시간으로부터 ±20분 이내에 체크할 수 있습니다"
          );
        }
        // 2. 체크 가능 시간이 같은 경우
      } else if (checkStart[0] == checkEnd[0]) {
        if (
          hour != checkStart[0] ||
          (hour == checkStart[0] &&
            (minute < checkStart[1] || minute > checkEnd[1]))
        ) {
          throw new Error(
            "완료 체크할 수 없는 습관입니다.\n지정한 완료시간으로부터 ±20분 이내에 체크할 수 있습니다"
          );
        }
      }
    }

    // split 문구에 맞춰서 삽입
    habit.checked = today + `|` + habit.checked;
    const res = await getConnection()
      .createQueryBuilder()
      .update(Habit)
      .set({
        checked: habit.checked,
      })
      .where("id = :id and userId = :userId", { id: habitId, userId })
      .execute();
    if (res.affected === 1) {
      return habit;
    }
    return null;
  }

  /** 습관 추가 */
  @Mutation(() => Habit)
  @UseMiddleware(isAuth)
  async createHabit(
    @Arg("habitInput") habitInput: HabitInput,
    @Ctx() { req }: ReqResContext
  ): Promise<Habit | null> {
    const { userId } = req.session;
    if (!userId) return null;

    // 습관 검증
    habitInput = await validateHabitInput(userId, habitInput);

    const res = await Habit.create({
      ...habitInput,
      userId,
    }).save();
    return res;
  }

  /** 습관 조회 */
  @Query(() => [Habit])
  @UseMiddleware(isAuth)
  async myHabits(@Ctx() { req }: ReqResContext): Promise<Habit[] | null> {
    const { userId } = req.session;
    if (!userId) return null;
    const habits = await Habit.find({ userId: userId });
    habits.forEach((habit) => {
      // 2022-02-10-월, 이런식으로 하나 당 12글자 + 구분글자 |,
      // 완료 표시를 하기 위해 최근 완료한 7개의 날짜를 가져간다
      // (일주일에 최대 7번 완료할 수 있으므로)
      habit.checked =
        habit.checked.length >= 12 * 7 + 1 * 6
          ? habit.checked.slice(0, 12 * 7 + 1 * 6)
          : habit.checked;
    });
    return habits;
  }

  /** 습관 1개 조회 */
  @Query(() => Habit)
  @UseMiddleware(isAuth)
  async myHabit(
    @Arg("habitId") habitId: number,
    @Ctx() { req }: ReqResContext
  ): Promise<Habit | null> {
    const { userId } = req.session;
    if (!userId) return null;
    const habit = await Habit.findOne({ userId, id: habitId });
    return habit ? habit : null;
  }

  /** 습관 삭제 */
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteHabit(
    @Arg("habitId", () => Int) habitId: number,
    @Ctx() { req }: ReqResContext
  ): Promise<boolean> {
    // 다른 유저가 내 습관을 없애버리는 불상사를 막기 위해 userId 추가
    const { userId } = req.session;
    if (!userId) return false;
    const res = await Habit.delete({ id: habitId, userId });
    if (res.affected == 1) return true;
    return false;
  }

  /** 습관 수정 */
  @Mutation(() => Habit)
  @UseMiddleware(isAuth)
  async editHabit(
    @Arg("habitId", () => Int) habitId: number,
    @Arg("habitInput") habitInput: HabitInput,
    @Ctx() { req }: ReqResContext
  ): Promise<Habit | null> {
    // 다른 유저가 내 습관을 수정해버리는 불상사를 막기 위해 userId 추가
    const { userId } = req.session;
    if (!userId) return null;

    habitInput = await validateHabitInput(userId, habitInput);

    const res = await getConnection()
      .createQueryBuilder()
      .update(Habit)
      .set({
        ...habitInput,
      })
      .where("id = :id and userId = :userId", { id: habitId, userId })
      .execute();
    if (res.affected === 1) {
      const habit = await Habit.findOne({ id: habitId, userId });
      return habit ? habit : null;
    }
    return null;
  }
}
