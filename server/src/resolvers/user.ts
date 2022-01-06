import {Resolver, Arg, Mutation, Query} from "type-graphql"
import {User} from "../entities/User"
import { User_IV } from "../entities/User_IV";
import { UserRegisterInput } from "../types/UserRegisterInput";
import { UserResponse } from "../types/UserResponse";
import { getRepository } from "typeorm";
import { makeUserAndIV } from "../modules/forUserResolver/makeUserAndIV";
import { notExpectedErr } from "../modules/errors";


@Resolver()
export class UserResolver {

    @Query(() => Boolean)
    async test(): Promise<boolean> {
        const user = await getRepository(User)
            .createQueryBuilder("user")
            .where("user.id = :id", {id: 1})
            .getOne();
        console.log(user);
        return true;
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("inputs") inputs: UserRegisterInput,
    ): Promise<UserResponse | boolean> {
        // 1. invalid한 input이 있는지 검사
        // const notValid = await validateRegister(inputs);
        // if (notValid.errors) {
        //     return notValid
        // }

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

        return true;
    }

    @Mutation(() => UserResponse)
    async login (
        @Arg("inputs") inputs: string,
    ): Promise<UserResponse> {
        // userid를 찾아보고 없으면 Error return
        const user = await User.findOne({userId: inputs});
        if (!user) {
            return {
                errors: [{
                    field: "userId",
                    message: "아이디가 존재하지 않습니다."
                }]
            };
        }
        return {user};
    }
}