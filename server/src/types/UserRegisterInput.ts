import { InputType, Field } from "type-graphql";

@InputType()
export class UserRegisterInput {
  @Field()
  userId: string; // 아이디

  @Field()
  password: string; // 비밀번호

  @Field()
  fullName: string; // 이름

  @Field()
  email: string; // 이메일 주소

  @Field()
  userName: string; // 별명

  @Field()
  bank: string; // 은행명

  @Field()
  account: string; // 계좌번호
}
