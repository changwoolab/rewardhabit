"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const User_IV_1 = require("../entities/User_IV");
const UserRegisterInput_1 = require("../types/UserRegisterInput");
const UserResponse_1 = require("../types/UserResponse");
const typeorm_1 = require("typeorm");
const makeUserAndIV_1 = require("../utils/forUserResolver/makeUserAndIV");
const errors_1 = require("../utils/errors");
const checkDuplicateRegister_1 = require("../utils/forUserResolver/checkDuplicateRegister");
const argon2_1 = __importDefault(require("argon2"));
const PartialUser_1 = require("../types/PartialUser");
const directQuerying_1 = require("../utils/directQuerying");
const encrypt_1 = require("../secret_modules/encrypt");
const constants_1 = require("../secret_modules/constants");
const sendEmail_1 = require("../utils/sendEmail");
const emailForm_1 = require("../utils/email/emailForm");
const uuid_1 = require("uuid");
const isAuth_1 = require("../middleware/isAuth");
const decryptUserInfo_1 = require("../utils/forUserResolver/decryptUserInfo");
let UserResolver = class UserResolver {
    email(user, { req }) {
        if (req.session.userId === user.id)
            return (0, decryptUserInfo_1.decrypeUserInfo)(user, "email");
        return "";
    }
    async bank(user, { req }) {
        if (req.session.userId === user.id)
            return (0, decryptUserInfo_1.decrypeUserInfo)(user, "bank");
        return "";
    }
    lastName(user, { req }) {
        if (req.session.userId === user.id)
            return (0, decryptUserInfo_1.decrypeUserInfo)(user, "lastName");
        return "";
    }
    firstName(user, { req }) {
        if (req.session.userId === user.id)
            return (0, decryptUserInfo_1.decrypeUserInfo)(user, "firstName");
        return "";
    }
    account(user, { req }) {
        if (req.session.userId === user.id)
            return (0, decryptUserInfo_1.decrypeUserInfo)(user, "account");
        return "";
    }
    registerDate(user, { req }) {
        if (req.session.userId === user.id)
            return user.registerDate;
        return "";
    }
    subscripts(user, { req }) {
        if (req.session.userId === user.id)
            return user.subscripts;
        return "";
    }
    async myAccount({ req }) {
        const { userId } = req.session;
        if (!userId)
            return null;
        const user = await User_1.User.findOne({ id: userId });
        if (!user)
            return null;
        return { user };
    }
    async me({ req }) {
        if (!req.session.userId)
            return null;
        const user = await User_1.User.findOne({ id: req.session.userId });
        if (!user)
            return null;
        const partialUser = new PartialUser_1.PartialUser(user);
        if (!partialUser)
            return errors_1.notExpectedErr;
        return { partialUser };
    }
    async register(inputs) {
        const notValid = await (0, checkDuplicateRegister_1.checkDuplicateRegister)(inputs);
        if (notValid === null || notValid === void 0 ? void 0 : notValid.errors) {
            return notValid;
        }
        const { user, iv } = await (0, makeUserAndIV_1.makeUserAndIV)(inputs);
        if (!user || !iv)
            return errors_1.notExpectedErr;
        const resUser = await (0, typeorm_1.getRepository)(User_1.User).save(user);
        if (!resUser)
            return errors_1.notExpectedErr;
        const resIV = await (0, typeorm_1.getRepository)(User_IV_1.User_IV).save(iv);
        if (!resIV) {
            await User_1.User.delete({ userId: user.userId });
            return errors_1.notExpectedErr;
        }
        const partialUser = new PartialUser_1.PartialUser(user);
        if (!partialUser)
            return errors_1.notExpectedErr;
        return { partialUser };
    }
    async login(userId, password, { req }) {
        const user = await User_1.User.findOne({ userId: userId });
        if (!user)
            return null;
        const valid = await argon2_1.default.verify(user.password, password);
        if (!valid)
            return null;
        req.session.userId = user.id;
        const partialUser = new PartialUser_1.PartialUser(user);
        if (!partialUser)
            return errors_1.notExpectedErr;
        return { partialUser };
    }
    async checkImmediateDuplicate(mode, input) {
        if (mode == "userId") {
            const user = await User_1.User.findOne({ where: { userId: input } });
            console.log(user);
            if (user) {
                return false;
            }
        }
        else if (mode == "userName") {
            const user = await User_1.User.findOne({ where: { userName: input } });
            console.log(user);
            if (user) {
                return false;
            }
        }
        else {
            let sql = "";
            if (mode == "account")
                sql = "SELECT account, accountIV FROM user JOIN user_iv ON (user.id = user_iv.userId);";
            else if (mode == "email")
                sql = "SELECT email, emailIV FROM user JOIN user_iv ON (user.id = user_iv.userId);";
            else
                return false;
            const users = await (0, directQuerying_1.directQuerying)(sql, []);
            for (let key in users) {
                let forDecrypte = {
                    encryptedData: users[key][mode],
                    iv: users[key][mode + "IV"]
                };
                const decryptedUserInfo = (0, encrypt_1.decrypt)(forDecrypte);
                if (input == decryptedUserInfo) {
                    return false;
                }
            }
        }
        return true;
    }
    async logout({ req, res }) {
        return await new Promise(resolve => req.session.destroy(err => {
            res.clearCookie(constants_1.COOKIE_NAME);
            if (err) {
                resolve(false);
                return;
            }
            resolve(true);
        }));
    }
    async forgotUserId(email) {
        if (!email)
            return false;
        const sql = "SELECT user.userId, email, emailIV FROM user JOIN user_iv ON (user.id = user_iv.userId);";
        const users = await (0, directQuerying_1.directQuerying)(sql, []);
        if (!users)
            return false;
        for (let key in users) {
            let beforeDecrypteEmail = {
                encryptedData: users[key].email,
                iv: users[key].emailIV
            };
            const decryptedEmail = (0, encrypt_1.decrypt)(beforeDecrypteEmail);
            if (email == decryptedEmail) {
                (0, sendEmail_1.sendEmail)(decryptedEmail, `[보상습관] 아이디 찾기`, (0, emailForm_1.emailForm)("보상습관 아이디 안내", "아이디 찾기를 통해 요청하신 아이디를 알려드립니다.", "요청하신 아이디", users[key].userId));
                return true;
            }
        }
        return false;
    }
    async forgotPassword(userId, email, { redis }) {
        if (!email || !userId)
            return false;
        const sql = "SELECT user.userId, email, emailIV FROM user JOIN user_iv ON (user.id = user_iv.userId) WHERE user.userId = ?;";
        const user = await (0, directQuerying_1.directQuerying)(sql, [userId]);
        if (!user)
            return false;
        let beforeDecrypteEmail = {
            encryptedData: user[0].email,
            iv: user[0].emailIV
        };
        const decryptedEmail = (0, encrypt_1.decrypt)(beforeDecrypteEmail);
        if (email == decryptedEmail) {
            const token = (0, uuid_1.v4)();
            await redis.set(constants_1.FORGOT_PASSWORD_PREFIX + token, userId, "EX", 60 * 10);
            (0, sendEmail_1.sendEmail)(decryptedEmail, `[보상습관] 비밀번호 찾기`, (0, emailForm_1.emailForm)("보상습관 비밀번호 안내", "비밀번호 찾기를 통해 요청하신 비밀번호 변경 URL을 알려드립니다.", "요청하신 URL", `<a href="http://localhost:3000/nidlogin/forgot/change-password/${token}">[비밀번호 변경 URL]</a>`));
            return true;
        }
        return false;
    }
    async changePassword(token, newPassword, { redis }) {
        const userId = await redis.get(constants_1.FORGOT_PASSWORD_PREFIX + token);
        if (!userId)
            return false;
        const hashedNewPassword = await argon2_1.default.hash(newPassword);
        if (!hashedNewPassword)
            return false;
        const result = await (0, typeorm_1.createQueryBuilder)()
            .update(User_1.User)
            .set({ password: hashedNewPassword })
            .where("userId = :userId", { userId: "cwyoo0101" })
            .execute();
        if (result.affected == 1)
            return true;
        return false;
    }
};
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User, Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "email", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "bank", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User, Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "lastName", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User, Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "firstName", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User, Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "account", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User, Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "registerDate", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User, Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "subscripts", null);
__decorate([
    (0, type_graphql_1.Query)(() => UserResponse_1.UserResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "myAccount", null);
__decorate([
    (0, type_graphql_1.Query)(() => UserResponse_1.UserResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse_1.UserResponse),
    __param(0, (0, type_graphql_1.Arg)("inputs")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserRegisterInput_1.UserRegisterInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse_1.UserResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("userId")),
    __param(1, (0, type_graphql_1.Arg)("password")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("mode")),
    __param(1, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "checkImmediateDuplicate", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotUserId", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("userId")),
    __param(1, (0, type_graphql_1.Arg)("email")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("token")),
    __param(1, (0, type_graphql_1.Arg)("newPassword")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)(User_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map