import { getConnection } from "typeorm";
import { UserRegisterInput } from "../../types/UserRegisterInput";
import { UserResponse } from "../../types/UserResponse";
import { decrypt } from "../encrypt/encrypt";

// email, account는 복호화를 한 뒤, 중복검사를 해줘야한다.
// 이거 3개만 여기서 처리하고 나머지 db에서 나올 수 있는 에러들은 message를 담아서 보내주면 됨.
export const checkDuplicateRegister = async (
  inputs: UserRegisterInput
): Promise<UserResponse | null> => {
  // 유저정보 가져오기 (User: account, email, User_iv: accountIV, emailIV)
  const sql =
    "SELECT account, email, accountIV, emailIV FROM user JOIN user_iv ON (user.id = user_iv.userId);";
  const users = await getConnection().query(sql, []);

  // 유저정보를 traverse하며 중복 정보가 있는지 확인 (비효율적인 알고리즘임)
  const forValidate = [
    ["account", "accountIV"],
    ["email", "emailIV"],
  ];
  for (let key1 in users) {
    for (let key2 in forValidate) {
      let forDecrypte = {
        encryptedData: users[key1][forValidate[key2][0]],
        iv: users[key1][forValidate[key2][1]],
      };
      const decryptedUserInfo = decrypt(forDecrypte);
      if (inputs[forValidate[key2][0]] == decryptedUserInfo) {
        return {
          errors: [
            {
              field: forValidate[key2][0],
              message: "중복되었습니다.",
            },
          ],
        };
      }
    }
  }

  return null;
};
