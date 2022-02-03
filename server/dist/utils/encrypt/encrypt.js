"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const constants_1 = require("../../secret_modules/constants");
const encrypt = (text) => {
    const iv = crypto_1.default.randomBytes(16);
    let cipher = crypto_1.default.createCipheriv(constants_1.ENCRYPT_ALGORITHM, Buffer.from(constants_1.ENCRYPT_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
        iv: iv.toString("hex"),
        encryptedData: encrypted.toString("hex"),
    };
};
exports.encrypt = encrypt;
const decrypt = (text) => {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto_1.default.createDecipheriv(constants_1.ENCRYPT_ALGORITHM, Buffer.from(constants_1.ENCRYPT_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};
exports.decrypt = decrypt;
//# sourceMappingURL=encrypt.js.map