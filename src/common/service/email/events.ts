import { EventEmitter } from "events";
import { sendEmail } from "./sendEmail";
import { emailTemplet } from "./emailTemplet";
import { OTP_ENUM } from "src/common/enum";

export const eventEmitter = new EventEmitter();
eventEmitter.on("confermemail", async (data) => {
  const { email, otp } = data;

  await sendEmail({
    to: email,
    subject: "Account Verification",
    html: emailTemplet(otp, OTP_ENUM.CONFIRMEMAIL),
  });
});
eventEmitter.on("forgetpassword", async (data) => {
  const { email, otp } = data;

  await sendEmail({
    to: email,
    subject: "Account Verification",
    html: emailTemplet(otp, OTP_ENUM.FORGET_PASSWORD),
  });


});
