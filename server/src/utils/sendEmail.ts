import nodemailer from "nodemailer"
import { EMAIL_ID, EMAIL_PW } from "../secret_modules/constants";

// to: 누구에게 보낼지, subject: 메일 제목, html: 어떤 내용을 보낼지
export async function sendEmail(to: string, subject: string, html: string) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: EMAIL_ID,
      pass: EMAIL_PW,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: '"보상습관👻" <rewardhabit@gmail.com>', // sender address
    to: to, // list of receivers
    subject, // Subject line
    html,
  });
}