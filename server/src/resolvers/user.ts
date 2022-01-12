import {Resolver, Arg, Mutation, Query, Ctx} from "type-graphql"
import {User} from "../entities/User"
import { User_IV } from "../entities/User_IV";
import { UserRegisterInput } from "../types/UserRegisterInput";
import { UserResponse } from "../types/UserResponse";
import { getRepository } from "typeorm";
import { makeUserAndIV } from "../utils/forUserResolver/makeUserAndIV";
import { notExpectedErr } from "../utils/errors";
import { checkDuplicateRegister } from "../utils/forUserResolver/checkDuplicateRegister";
import argon2 from "argon2";
import { ReqResContext } from "../types/ReqResContext";
import { PartialUser } from "../types/PartialUser";
import { directQuerying } from "../utils/directQuerying";
import { decrypt } from "../secret_modules/encrypt";
import { COOKIE_NAME } from "../secret_modules/constants";


@Resolver()
export class UserResolver {
    @Query(() => UserResponse, { nullable: true })
    async me(
        @Ctx() {req}: ReqResContext
    ): Promise<UserResponse | null> {
        if (!req.session.userId) return null;
        const user = await User.findOne({id: req.session.userId});
        if (!user) return null;
        const partialUser = new PartialUser(user);
        if (!partialUser) return notExpectedErr;
        return { partialUser };
    }

    // Register try-catch 문으로 수정하기! (모든 Error를 처리할 수 있도록..)
    @Mutation(() => UserResponse)
    async register(
        @Arg("inputs") inputs: UserRegisterInput,
    ): Promise<UserResponse> {
        // 1. 중복된 input이 있는지 한 번 더 검사 (HOXY 모르니)
        const notValid = await checkDuplicateRegister(inputs);
        if (notValid.errors) {
            return notValid
        }

        // 2. 주어진 Input을 바탕으로 암호화 된 user 및 iv 객체 만들기
        const { user, iv } = await makeUserAndIV(inputs);
        if (!user || !iv) return notExpectedErr;

        // 3. DB에 저장
        const resUser = await getRepository(User).save(user);
        if (!resUser) return notExpectedErr;
        const resIV = await getRepository(User_IV).save(iv);
        if (!resIV) {
            // IV가 삽입되지 않은 경우, 방금 삽입한 데이터는 쓸모없어지므로 해당 유저 데이터 삭제
            await User.delete({userId: user.userId});
            return notExpectedErr;
        }

        const partialUser = new PartialUser(user);
        if (!partialUser) return notExpectedErr;
        return { partialUser };
    }

    // 로그인
    @Mutation(() => UserResponse, {nullable: true})
    async login (
        @Arg("userId") userId: string,
        @Arg("password") password: string,
        @Ctx() { req }: ReqResContext
    ): Promise<UserResponse | null> {
        // userid를 찾아보고 없으면 Error return
        const user = await User.findOne({userId: userId});
        if (!user) return null; // 한 번만 쓰고 싶었지만 아래 user.password 타입을 명확하게 해줘야해서 적음..

        // password validation
        const valid = await argon2.verify(user.password, password);
        if (!valid) return null;

        // Session & Cookie를 설정해준다.
        req.session.userId = user.id;

        const partialUser = new PartialUser(user);
        if (!partialUser) return notExpectedErr;
        return { partialUser };
    }

    // 회원가입 시 userId, userName, Email, Account Field를 입력했을 때 즉시 중복검사를 해주는 Query
    // Query로 할 시, urql useQuery할 때 Variable 속성을 Reexecute로 바꿀 수 없는 문제점이 발생함.
    // 따라서, Mutation으로 하는 수 없이 구현했음.
    @Mutation(() => Boolean)
    async checkImmediateDuplicate(
        @Arg("mode") mode: string,
        @Arg("input") input: string
    ): Promise<Boolean> {
        if (mode == "userId" || mode == "userName") {
            const users = await User.find({select: [mode]});
            for (let key in users) {
                if (input == users[key].userId) {
                   return false
                }
            }
        } else {
            let sql = "";
            if (mode == "account") sql = "SELECT account, accountIV FROM user JOIN user_iv ON (user.id = user_iv.userId);"
            else if (mode == "email") sql = "SELECT email, emailIV FROM user JOIN user_iv ON (user.id = user_iv.userId);"
            else return false;
            const users = await directQuerying(sql, []);

            for (let key in users) {
                let forDecrypte = {
                    encryptedData: users[key][mode],
                    iv: users[key][mode+"IV"]
                }
                const decryptedUserInfo = decrypt(forDecrypte);
                if (input == decryptedUserInfo) {
                    return false;
                }
            }
        }
        return true;
    }


    // 로그아웃
    @Mutation(() => Boolean)
    async logout(
        @Ctx() { req, res }: ReqResContext
    ) {
        // 1. req.session.destroy()를 통해서 세션을 제거함으로써 로그아웃 가능
        // 단, 위의 req.session.destroy의 콜백함수는 void를 리턴하기 때문에 Boolean을 리턴하기 위해서는 Promise를 만들 필요가 있음.
        return await new Promise(resolve => req.session.destroy(err => {
            // 2. 쿠키 제거
            res.clearCookie(COOKIE_NAME);
            // 에러 발생 -> return false
            if (err) {
                resolve(false);
                return;
            }
            resolve(true);
        }))
    }
}
