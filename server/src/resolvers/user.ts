import {Resolver, Arg, Mutation, Query, Ctx} from "type-graphql"
import {User} from "../entities/User"
import { User_IV } from "../entities/User_IV";
import { UserRegisterInput } from "../types/UserRegisterInput";
import { UserResponse } from "../types/UserResponse";
import { getRepository } from "typeorm";
import { makeUserAndIV } from "../modules/forUserResolver/makeUserAndIV";
import { loginErr, notExpectedErr } from "../modules/errors";
import { checkDuplicateRegister } from "../modules/forUserResolver/checkDuplicateRegister";
import argon2 from "argon2";
import { ReqResContext } from "../types/ReqResContext";
import { PartialUser } from "../types/PartialUser";


@Resolver()
export class UserResolver {
    @Query(() => UserResponse, { nullable: true })
    async loggedIn(
        @Ctx() {req}: ReqResContext
    ): Promise<UserResponse | null> {
        if (!req.session.userId) return null;
        const user = await User.findOne({id: req.session.userId});
        if (!user) return null;
        const partialUser = new PartialUser(user);
        if (!partialUser) return notExpectedErr;
        return {partialUser: partialUser};
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("inputs") inputs: UserRegisterInput,
    ): Promise<UserResponse> {
        // 1. invalid한 input이 있는지 검사 (글자수제한, 이메일형식 등)
        ///////////////////////////////////////////////////////////////////////////////



        ///////////////////////////////////////////////////////////////////////////////

        // 2. 중복된 input이 있는지 검사
        const notValid = await checkDuplicateRegister(inputs);
        if (notValid.errors) {
            return notValid
        }

        // 3. 주어진 Input을 바탕으로 암호화 된 user 및 iv 객체 만들기
        const { user, iv } = await makeUserAndIV(inputs);
        if (!user || !iv) return notExpectedErr;

        // 4. DB에 저장
        const resUser = await getRepository(User).save(user);
        if (!resUser) return notExpectedErr;
        const resIV = await getRepository(User_IV).save(iv);
        if (!resIV) {
            // IV가 삽입되지 않은 경우, 방금 삽입한 데이터는 쓸모없어지므로 해당 유저 데이터 삭제
            await User.delete({userId: user.userId});
            return notExpectedErr;
        }

        return {
            succeed: true
        };
    }

    @Mutation(() => UserResponse)
    async login (
        @Arg("userId") userId: string,
        @Arg("password") password: string,
        @Ctx() { req }: ReqResContext
    ): Promise<UserResponse> {
        // userid를 찾아보고 없으면 Error return
        const user = await User.findOne({userId: userId});
        if (!user) return loginErr; // 한 번만 쓰고 싶었지만 아래 user.password 타입을 명확하게 해줘야해서 적음..

        // password validation
        const valid = await argon2.verify(user.password, password);
        if (!valid) return loginErr

        // Session & Cookie를 설정해준다.
        req.session.userId = user.id;

        return { 
            succeed: true
        };
    }
}