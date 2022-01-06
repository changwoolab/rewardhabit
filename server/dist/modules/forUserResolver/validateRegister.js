"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const User_1 = require("../../entities/User");
const typeorm_1 = require("typeorm");
const validateRegister = async (input) => {
    const users = await (0, typeorm_1.createQueryBuilder)()
        .select("user")
        .from(User_1.User, "user")
        .where("userid")
        .getOne();
    return {
        errors: [{
                field: "asdf",
                message: "Asdf"
            }]
    };
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map