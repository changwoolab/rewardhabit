import { ObjectType, Field } from "type-graphql";

// Error message를 처리할 때 사용
@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}
