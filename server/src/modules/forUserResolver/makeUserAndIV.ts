import { User } from "../../entities/User";
import { User_IV } from "../../entities/User_IV";
import { EncryptedData, keysToBeEncrypted } from "../../types/Encrypted";
import { UserRegisterInput } from "../../types/UserRegisterInput";
import argon2 from "argon2";

// user 객체 만들기
export const makeUserAndIV = async (inputs: UserRegisterInput) => {
    // 유저 및 iv 객체 생성
    const user = new User();
    const iv = new User_IV();

    // 민감정보 암호화
    const encryptedData = new EncryptedData(inputs);

    // argon2로 비밀번호 암호화
    const hashedPassword = await argon2.hash(inputs.password);
    const date = new Date();
    user.password = hashedPassword;
    user.registerDate = date;
    
    // Encrypted data를 user, iv에 저장
    keysToBeEncrypted.forEach(key => {
        user[key] = encryptedData[key].encryptedData;
        iv[key+"IV"] = encryptedData[key].iv;
    });

    // 나머지 Data 저장
    user.userId = inputs.userId;
    user.userName = inputs.userName;
    user.point = 0;
    user.level = 1;
    user.exp = 0;

    // Foreign key 설정
    iv.user = user;

    return {user, iv};
}
