"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const encrypt_1 = require("../../secret_modules/encrypt");
const directQuerying_1 = require("../directQuerying");
const validateRegister = async (inputs) => {
    const sql = "SELECT user.userId, account, email, userIdIV, accountIV, emailIV FROM user JOIN user_iv ON (user.id = user_iv.userId);";
    const users = await (0, directQuerying_1.directQuerying)(sql, []);
    const forValidate = [["userId", "userIdIV"], ["account", "accountIV"], ["email", "emailIV"]];
    for (let key1 in users) {
        for (let key2 in forValidate) {
            let forDecrypte = {
                encryptedData: users[key1][forValidate[key2][0]],
                iv: users[key1][forValidate[key2][1]]
            };
            const decryptedUserInfo = (0, encrypt_1.decrypt)(forDecrypte);
            if (inputs[forValidate[key2][0]] == decryptedUserInfo) {
                return {
                    errors: [{
                            field: forValidate[key2][0],
                            message: "중복되었습니다."
                        }]
                };
            }
        }
    }
    return {
        succeed: true
    };
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map