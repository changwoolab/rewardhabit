import { ReqResContext } from "../types/ReqResContext";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
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
}

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
        const res = await Habit.create({
            ...habitInput,
            userId,
        }).save();
        return res;
    }

    /** 습관 조회 */
    @Query(() => [Habit])
    @UseMiddleware(isAuth)
    async myHabits(
        @Ctx() { req }: ReqResContext
    ): Promise<Habit[] | null> {
        const {userId} = req.session;
        if (!userId) return null;
        const habits = await Habit.find({userId: userId});
        return habits;
    }

    /** 습관 삭제 */
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteHabit(
        @Arg("habitId") habitId: number,
        @Ctx() { req }: ReqResContext
    ): Promise<boolean> {
        // 다른 유저가 내 습관을 없애버리는 불상사를 막기 위해 userId 추가
        const { userId } = req.session;
        if(!userId) return false;
        const res = await Habit.delete({id: habitId, userId});
        if (res.affected == 1) return true;
        return false;
    }

    /** 습관 수정 */
    @Mutation(() => Habit)
    @UseMiddleware(isAuth)
    async editHabit(
        @Arg("habitId") habitId: number,
        @Arg("habitInput") habitInput: HabitInput,
        @Ctx() { req }: ReqResContext
    ): Promise<Habit|null> {
        // 다른 유저가 내 습관을 수정해버리는 불상사를 막기 위해 userId 추가
        const { userId } = req.session;
        if(!userId) return null;
        const res = await getConnection()
        .createQueryBuilder()
        .update(Habit)
        .set({
            ...habitInput
        })
        .where("id = :id and userId = :userId", {id: habitId, userId})
        .execute();
        if (res.affected === 1) {
            const habit = await Habit.findOne({id: habitId, userId});
            return habit ? habit : null;
        }
        return null;
    }
}
