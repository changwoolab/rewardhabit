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
  if (habitDay == "0000000" || habitDay.length != 7) throw new Error("올바른 요일을 선택하세요");
  // 입력은 0010000이런식으로 수가 들어와야 함
  if (Number.isNaN(Number(habitDay))) throw new Error("올바른 요일을 입력하세요");
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
