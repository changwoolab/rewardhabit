import { User } from "../entities/User";
import { ObjectType, Field } from "type-graphql";
import { FieldError } from "./FieldError";

// User에 관한 query에 대한 Response를 보낼 때 사용
@ObjectType()
export class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];
    @Field(() => User, {nullable: true})
    user?: User;
    @Field(() => Boolean, {nullable: true})
    succeed?: boolean
}