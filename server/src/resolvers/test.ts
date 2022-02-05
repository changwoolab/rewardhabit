import { User } from "../entities/User";
import { Resolver, Query } from "type-graphql";
import { getRepository } from "typeorm";

@Resolver()
export class TestResolver {
  @Query(() => Boolean)
  async test(): Promise<boolean> {
    const user = await getRepository(User)
      .createQueryBuilder("user")
      .where("user.id = :id", { id: 1 })
      .getOne();
    console.log(user);
    return true;
  }
}
