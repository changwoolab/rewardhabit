import { ReqResContext } from "../types/ReqResContext";
import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Subscript } from "../entities/Subscript";
import { getManager } from "typeorm";

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
}
