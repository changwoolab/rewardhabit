"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUserAndIV = void 0;
const User_1 = require("../../entities/User");
const User_IV_1 = require("../../entities/User_IV");
const Encrypted_1 = require("../../types/Encrypted");
const argon2_1 = __importDefault(require("argon2"));
const makeUserAndIV = async (inputs) => {
    const user = new User_1.User();
    const iv = new User_IV_1.User_IV();
    const encryptedData = new Encrypted_1.EncryptedData(inputs);
    const hashedPassword = await argon2_1.default.hash(inputs.password);
    const date = new Date();
    user.password = hashedPassword;
    user.registerDate = date;
    Encrypted_1.keysToBeEncrypted.forEach(key => {
        user[key] = encryptedData[key].encryptedData;
        iv[key + "IV"] = encryptedData[key].iv;
    });
    user.userId = inputs.userId;
    user.userName = inputs.userName;
    user.point = 0;
    user.level = 1;
    user.exp = 0;
    iv.user = user;
    return { user, iv };
};
exports.makeUserAndIV = makeUserAndIV;
//# sourceMappingURL=makeUserAndIV.js.map