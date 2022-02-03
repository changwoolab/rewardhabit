"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const constants_1 = require("../secret_modules/constants");
const { OAuth2 } = googleapis_1.google.auth;
const oAuth2Client = new OAuth2(constants_1.GOOGLE_API_CLIENTID, constants_1.GOOGLE_API_CLIENTSECRET);
oAuth2Client.setCredentials({ refresh_token: constants_1.REFRESH_TOKEN });
//# sourceMappingURL=googleTest.js.map