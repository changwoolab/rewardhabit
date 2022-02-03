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
exports.HabitResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Habit_1 = require("../entities/Habit");
const isAuth_1 = require("../middleware/isAuth");
const typeorm_1 = require("typeorm");
let HabitInput = class HabitInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], HabitInput.prototype, "habitDay", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], HabitInput.prototype, "habitName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], HabitInput.prototype, "habitStart", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], HabitInput.prototype, "habitEnd", void 0);
HabitInput = __decorate([
    (0, type_graphql_1.InputType)()
], HabitInput);
let HabitResolver = class HabitResolver {
    async createHabit(habitInput, { req }) {
        const { userId } = req.session;
        if (!userId)
            return null;
        const res = await Habit_1.Habit.create(Object.assign(Object.assign({}, habitInput), { userId })).save();
        return res;
    }
    async myHabits({ req }) {
        const { userId } = req.session;
        if (!userId)
            return null;
        const habits = await Habit_1.Habit.find({ userId: userId });
        return habits;
    }
    async deleteHabit(habitId, { req }) {
        const { userId } = req.session;
        if (!userId)
            return false;
        const res = await Habit_1.Habit.delete({ id: habitId, userId });
        if (res.affected == 1)
            return true;
        return false;
    }
    async editHabit(habitId, habitInput, { req }) {
        const { userId } = req.session;
        if (!userId)
            return null;
        const res = await (0, typeorm_1.getConnection)()
            .createQueryBuilder()
            .update(Habit_1.Habit)
            .set(Object.assign({}, habitInput))
            .where("id = :id and userId = :userId", { id: habitId, userId })
            .execute();
        if (res.affected === 1) {
            const habit = await Habit_1.Habit.findOne({ id: habitId, userId });
            return habit ? habit : null;
        }
        return null;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => Habit_1.Habit),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("habitInput")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [HabitInput, Object]),
    __metadata("design:returntype", Promise)
], HabitResolver.prototype, "createHabit", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Habit_1.Habit]),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HabitResolver.prototype, "myHabits", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("habitId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], HabitResolver.prototype, "deleteHabit", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Habit_1.Habit),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("habitId")),
    __param(1, (0, type_graphql_1.Arg)("habitInput")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, HabitInput, Object]),
    __metadata("design:returntype", Promise)
], HabitResolver.prototype, "editHabit", null);
HabitResolver = __decorate([
    (0, type_graphql_1.Resolver)(Habit_1.Habit)
], HabitResolver);
exports.HabitResolver = HabitResolver;
//# sourceMappingURL=habit.js.map