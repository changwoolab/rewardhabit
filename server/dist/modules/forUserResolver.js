"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
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
//# sourceMappingURL=forUserResolver.js.map