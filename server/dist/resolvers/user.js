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
const makeUserAndIV_1 = require("../modules/forUserResolver/makeUserAndIV");
const errors_1 = require("../modules/errors");
const checkDuplicateRegister_1 = require("../modules/forUserResolver/checkDuplicateRegister");
const argon2_1 = __importDefault(require("argon2"));
const PartialUser_1 = require("../types/PartialUser");
const directQuerying_1 = require("../modules/directQuerying");
const encrypt_1 = require("../secret_modules/encrypt");
let UserResolver = class UserResolver {
    async me({ req }) {
        if (!req.session.userId)
            return null;
        const user = await User_1.User.findOne({ id: req.session.userId });
        if (!user)
            return null;
        const partialUser = new PartialUser_1.PartialUser(user);
        if (!partialUser)
            return errors_1.notExpectedErr;
        return { partialUser: partialUser };
    }
    async register(inputs) {
        const notValid = await (0, checkDuplicateRegister_1.checkDuplicateRegister)(inputs);
        if (notValid.errors) {
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
        return {
            succeed: true
        };
    }
    async login(userId, password, { req }) {
        const user = await User_1.User.findOne({ userId: userId });
        if (!user)
            return false;
        const valid = await argon2_1.default.verify(user.password, password);
        if (!valid)
            return false;
        req.session.userId = user.id;
        return true;
    }
    async checkImmediateDuplicate(mode, input) {
        if (mode == "userId" || mode == "userName") {
            const users = await User_1.User.find({ select: [mode] });
            for (let key in users) {
                if (input == users[key].userId) {
                    return false;
                }
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
};
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
    (0, type_graphql_1.Mutation)(() => Boolean),
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
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map