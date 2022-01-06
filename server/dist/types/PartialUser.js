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
exports.PartialUser = void 0;
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
let PartialUser = class PartialUser {
    constructor(user) {
        const target = ["id", "userId", "userName", "point", "level", "exp"];
        target.forEach(key => {
            this[key] = user[key];
        });
    }
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], PartialUser.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PartialUser.prototype, "userId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PartialUser.prototype, "userName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], PartialUser.prototype, "point", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], PartialUser.prototype, "level", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], PartialUser.prototype, "exp", void 0);
PartialUser = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [User_1.User])
], PartialUser);
exports.PartialUser = PartialUser;
//# sourceMappingURL=PartialUser.js.map