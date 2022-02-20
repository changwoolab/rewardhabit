import { ReqResContext } from "../types/ReqResContext";
import { Arg, Ctx, FieldResolver, Mutation, Resolver, Root, UseMiddleware } from "type-graphql";
import { Subscript } from "../entities/Subscript";
import { getManager } from "typeorm";
import { isAuth } from "../middleware/isAuth";
import { InputType, Field } from "type-graphql";
import { User } from "../entities/User";

@InputType()
export class DoSubscriptInput {
  @Field()
  type: string; // 타입

  @Field()
  reward: string; // 일일반환액

  @Field()
  term: string; // 기간

  @Field()
  totalPayment: string; // 결제금액
}

@Resolver(Subscript)
export class SubscriptResolver {
  @FieldResolver(() => String, { nullable: true })
  async daysRemain(
    @Root() subscript: Subscript,
    @Ctx() { req }: ReqResContext
  ) {
    const today = new Date();
    let diff = subscript.expireAt.getTime() - today.getTime();
    diff = Math.ceil(diff / (1000 * 3600 * 24));
    return diff <= 0 ? 0 : diff;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async doSubscript(
    @Arg("type") type: number,
    @Arg("target") target: number,
    @Arg("reward") reward: number,
    @Arg("term") term: number,
    @Ctx() { req }: ReqResContext
  ): Promise<Boolean> {
    const { userId } = req.session;
    const user = await User.findOne({id: userId})
    // 1. 해당 유저에게 이미 구독이 있는지 확인
    const existingSubscript = await Subscript.findOne({userId});
    // 2. 구독한 적이 있다면
    if (existingSubscript) {
      // 2-1. 만료기간이 지난 경우 -> 기존구독 삭제 & 새 구독 삽입
      const today = new Date();
      let diff = existingSubscript.expireAt.getTime()-today.getTime();
      diff = Math.ceil(diff / (1000 * 3600 * 24));
      if (diff <= 0) {
        
      }
      // 2-2. 만료기간이 지나지 않은 경우 -> throw Error

      // 3. 구독중이지 않다면, 새로운 구독 삽입하기
    } else {

    }
    return false;
  }

  /** 이미 구독중인지 확인해줌, 이미 구독중이면 결제 못하도록 함 */
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async checkSubscript(): Promise<Boolean> {
    return false;
  }
}
