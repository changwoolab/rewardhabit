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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestResolver = void 0;
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
let TestResolver = class TestResolver {
    async test() {
        const user = await (0, typeorm_1.getRepository)(User_1.User)
            .createQueryBuilder("user")
            .where("user.id = :id", { id: 1 })
            .getOne();
        console.log(user);
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => Boolean),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestResolver.prototype, "test", null);
TestResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], TestResolver);
exports.TestResolver = TestResolver;
//# sourceMappingURL=test.js.map