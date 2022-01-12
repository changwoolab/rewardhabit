"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const constants_1 = require("../secret_modules/constants");
async function sendEmail(to, html) {
    let transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
            user: constants_1.EMAIL_ID,
            pass: constants_1.EMAIL_PW,
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    let info = await transporter.sendMail({
        from: '"보상습관👻" <rewardhabit@gmail.com>',
        to: to,
        subject: "Hello ✔",
        html,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
}
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map