import { ObjectType, Field } from "type-graphql";
import { FieldError } from "./FieldError";
import { PartialUser } from "./PartialUser";

// User에 관한 query에 대한 Response를 보낼 때 사용
@ObjectType()
export class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];
    @Field(() => PartialUser, {nullable: true})
    partialUser?: PartialUser
}