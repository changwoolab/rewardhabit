import { encrypt } from "../secret_modules/encrypt";
import { UserRegisterInput } from "./UserRegisterInput";

export const keysToBeEncrypted = ["lastName", "firstName", "email", "bank", "account"];

export class Encrypted {
    iv: string;
    encryptedData: string;
}

export class EncryptedData {
    constructor (inputs: UserRegisterInput) {
        keysToBeEncrypted.forEach(key => {
            this[key] = encrypt(inputs[key]);
        });
    }
    lastName: Encrypted;
    firstName: Encrypted;
    email: Encrypted;
    bank: Encrypted;
    account: Encrypted;
}
