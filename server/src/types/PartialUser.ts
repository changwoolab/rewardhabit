import { User } from "../entities/User";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class PartialUser {
  constructor(user: User) {
    const target = ["id", "userId", "userName", "point", "level", "exp"];
    target.forEach((key) => {
      this[key] = user[key];
    });
  }
  @Field()
  id: number;
  @Field()
  userId: string;
  @Field()
  userName: string;
  @Field()
  point: number;
  @Field()
  level: number;
  @Field()
  exp: number;
}
