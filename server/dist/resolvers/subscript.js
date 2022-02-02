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
exports.SubscriptResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Subscript_1 = require("../entities/Subscript");
const typeorm_1 = require("typeorm");
let SubscriptResolver = class SubscriptResolver {
    async daysRemain(subscript, { req }) {
        const res = await (0, typeorm_1.getManager)()
            .query(`
        select datediff(expireAt, startedAt) as dateDiff from subscript where userId = ?;
        `, [req.session.userId]);
        return res[0].dateDiff;
    }
};
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String, { nullable: true }),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Subscript_1.Subscript, Object]),
    __metadata("design:returntype", Promise)
], SubscriptResolver.prototype, "daysRemain", null);
SubscriptResolver = __decorate([
    (0, type_graphql_1.Resolver)(Subscript_1.Subscript)
], SubscriptResolver);
exports.SubscriptResolver = SubscriptResolver;
//# sourceMappingURL=subscript.js.map