import crypto from "crypto";
import { Encrypted } from "../../types/Encrypted";
import { ENCRYPT_ALGORITHM, ENCRYPT_KEY } from "../../secret_modules/constants";

export const encrypt = (text: string) => {
  const iv = crypto.randomBytes(16); // Random Initialize Vector 생성
  let cipher = crypto.createCipheriv(
    ENCRYPT_ALGORITHM,
    Buffer.from(ENCRYPT_KEY),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted.toString("hex"),
  };
};

export const decrypt = (text: Encrypted) => {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");

  // Creating Decipher
  let decipher = crypto.createDecipheriv(
    ENCRYPT_ALGORITHM,
    Buffer.from(ENCRYPT_KEY),
    iv
  );

  // Updating encrypted text
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  // returns data after decryption
  return decrypted.toString();
};
