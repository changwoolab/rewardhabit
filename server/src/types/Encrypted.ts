import { encrypt } from "../utils/encrypt/encrypt";
import { MyAccountInput } from "./MyAccountInput";
import { UserRegisterInput } from "./UserRegisterInput";

export const keysToBeEncrypted = [
  "fullName",
  "email",
  "bank",
  "account",
];

export class Encrypted {
  iv: string;
  encryptedData: string;
}

export class EncryptedData {
  constructor(inputs: UserRegisterInput | MyAccountInput) {
    keysToBeEncrypted.forEach((key) => {
      this[key] = encrypt(inputs[key]);
    });
  }
  fullName: Encrypted;
  email: Encrypted;
  bank: Encrypted;
  account: Encrypted;
}
