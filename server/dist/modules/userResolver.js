"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUser = exports.validateRegister = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const argon2_1 = __importDefault(require("argon2"));
const Encrypted_1 = require("../types/Encrypted");
const User_IV_1 = require("../entities/User_IV");
const validateRegister = async (input) => {
    const users = await (0, typeorm_1.createQueryBuilder)()
        .select("user")
        .from(User_1.User, "user")
        .where("userid")
        .getOne();
    let user;
    return {
        errors: [{
                field: "asdf",
                message: "Asdf"
            }]
    };
};
exports.validateRegister = validateRegister;
const makeUser = async (inputs, encryptedData) => {
    const user = new User_1.User();
    const iv = new User_IV_1.User_IV();
    const hashedPassword = await argon2_1.default.hash(inputs.password);
    const date = new Date();
    user.password = hashedPassword;
    user.registerDate = date;
    Encrypted_1.keysToBeEncrypted.forEach(key => {
        user[key] = encryptedData[key];
        iv[key] = encryptedData[key];
    });
    user.userName = inputs.userName;
    user.point = 0;
    user.level = 1;
    user.exp = 0;
    return { user, iv };
};
exports.makeUser = makeUser;
//# sourceMappingURL=userResolver.js.map