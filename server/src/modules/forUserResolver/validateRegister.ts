import { User } from "../../entities/User";
import { UserRegisterInput } from "../../types/UserRegisterInput";
import { UserResponse } from "../../types/UserResponse";
import { createQueryBuilder } from "typeorm";

// userId, email, account는 복호화를 한 뒤, 중복검사를 해줘야한다.
// 이거 3개만 여기서 처리하고 나머지 db에서 나올 수 있는 에러들은 message를 담아서 보내주면 됨.
export const validateRegister = async (input: UserRegisterInput): Promise<UserResponse> => {
    // 유저정보 가져오기 (User: userId, account, email, User_iv: userIdIV, accountIV, emailIV)
    const users = await createQueryBuilder()
        .select("user")
        .from(User, "user")
        .where("userid")
        .getOne();

    // 유저정보를 traverse하며 중복 정보가 있는지 확인
    // Object.keys(users).forEach(key1 => {
    //     Object.keys(users[key1 as keyof typeof user]).forEach(key2 => {
    //         if (key2 === "email" || key2 == "account") {
    //             console.log(key2, users[key1 as keyof typeof user][key2 as keyof typeof user])
    //         }
    //     })
    // })
    return {
        errors: [{
            field: "asdf",
            message: "Asdf"
        }]
    }
}
