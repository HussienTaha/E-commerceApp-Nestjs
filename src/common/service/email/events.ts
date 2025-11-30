import { EventEmitter } from "events";
import { sendEmail } from "./sendEmail";
import { emailTemplet } from "./emailTemplet";

export const eventEmitter = new EventEmitter();
eventEmitter.on("confermemail", async (data) => {
  const { email, otp } = data;

  await sendEmail({
    to: email,
    subject: "Account Verification",
    html: emailTemplet(otp),
  });
});
eventEmitter.on("forgetpassword", async (data) => {
  const { email, otp } = data;

  await sendEmail({
    to: email,
    subject: "Account Verification",
    html: emailTemplet(otp),
  });


});
