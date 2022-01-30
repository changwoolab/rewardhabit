import { User_IV } from "../../entities/User_IV";
import { User } from "../../entities/User";
import { decrypt } from "../../secret_modules/encrypt";



export const decrypeUserInfo = async (user: User, mode: string) => {
    const userIv = await User_IV.findOne({user});
    if (!userIv) return ""
    let forDecrypte = {
        encryptedData: user[mode],
        iv: userIv[mode+"IV"]
    }
    const decryptedBankInfo = decrypt(forDecrypte);
    return decryptedBankInfo;
}
