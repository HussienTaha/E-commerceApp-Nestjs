

import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { AppError } from 'src/module/user/user.service';

export const sendEmail = async (mailOptions: Mail.Options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,     
        pass: process.env.PASSWORD, 
      },
    });

    const info = await transporter.sendMail({
      from: `"E-commercceApp" <${process.env.EMAIL}>`,
      ...mailOptions, 
    });

    console.log("✅ Message sent:", info.messageId);
    return info;
  } catch (error: any) {
    console.error("❌ Error while sending email:", error.message);
throw new AppError(error.message);
  }
};
export const generateOtp = async () => {
  const otp = Math.floor( Math.random() *( 900000-100000+1)+100000);
  return otp;
};


