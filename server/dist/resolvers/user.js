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
const validateRegister_1 = require("../modules/forUserResolver/validateRegister");
let UserResolver = class UserResolver {
    async test() {
        const user = await (0, typeorm_1.getRepository)(User_1.User)
            .createQueryBuilder("user")
            .where("user.id = :id", { id: 1 })
            .getOne();
        console.log(user);
        return true;
    }
    async register(inputs) {
        const notValid = await (0, validateRegister_1.validateRegister)(inputs);
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
    async login(inputs) {
        const user = await User_1.User.findOne({ userId: inputs });
        if (!user) {
            return {
                errors: [{
                        field: "userId",
                        message: "아이디가 존재하지 않습니다."
                    }]
            };
        }
        return { user };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => Boolean),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "test", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse_1.UserResponse),
    __param(0, (0, type_graphql_1.Arg)("inputs")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserRegisterInput_1.UserRegisterInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse_1.UserResponse),
    __param(0, (0, type_graphql_1.Arg)("inputs")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map