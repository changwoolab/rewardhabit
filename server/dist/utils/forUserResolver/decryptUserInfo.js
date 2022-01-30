"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypeUserInfo = void 0;
const User_IV_1 = require("../../entities/User_IV");
const encrypt_1 = require("../../secret_modules/encrypt");
const decrypeUserInfo = async (user, mode) => {
    const userIv = await User_IV_1.User_IV.findOne({ user });
    if (!userIv)
        return "";
    let forDecrypte = {
        encryptedData: user[mode],
        iv: userIv[mode + "IV"]
    };
    const decryptedBankInfo = (0, encrypt_1.decrypt)(forDecrypte);
    return decryptedBankInfo;
};
exports.decrypeUserInfo = decrypeUserInfo;
//# sourceMappingURL=decryptUserInfo.js.map