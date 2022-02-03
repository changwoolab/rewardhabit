"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptedData = exports.Encrypted = exports.keysToBeEncrypted = void 0;
const encrypt_1 = require("../utils/encrypt/encrypt");
exports.keysToBeEncrypted = ["lastName", "firstName", "email", "bank", "account"];
class Encrypted {
}
exports.Encrypted = Encrypted;
class EncryptedData {
    constructor(inputs) {
        exports.keysToBeEncrypted.forEach(key => {
            this[key] = (0, encrypt_1.encrypt)(inputs[key]);
        });
    }
}
exports.EncryptedData = EncryptedData;
//# sourceMappingURL=Encrypted.js.map