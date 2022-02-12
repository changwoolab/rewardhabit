import { ReqResContext } from "../types/ReqResContext";
import { Ctx, FieldResolver, Mutation, Resolver, Root, UseMiddleware } from "type-graphql";
import { Subscript } from "../entities/Subscript";
import { getManager } from "typeorm";
import { isAuth } from "../middleware/isAuth";
import { InputType, Field } from "type-graphql";

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
    const res = await getManager().query(
      `
        select datediff(expireAt, startedAt) as dateDiff from subscript where userId = ?;
        `,
      [req.session.userId]
    );
    return res[0].dateDiff;
  }

  @Mutation(() => String)
  @UseMiddleware(isAuth)
  async doSubscript() {
    let date = new Date();
    console.log(date);
  }
}
