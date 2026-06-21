import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationCode(email: string, code: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"PrimeAutomation" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your verification code for PrimeAutomation",
      text: `Your verification code is: ${code}\n\nThis code expires in 10 minutes.`,
      html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <h2>PrimeAutomation</h2>
        <p>Your verification code is:</p>
        <div style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;padding:16px;background:#f3f4f6;border-radius:8px;">${code}</div>
        <p style="color:#6b7280;font-size:14px;">This code expires in 10 minutes.</p>
      </div>`,
    });
    return true;
  } catch (err) {
    console.error("Failed to send email:", err);
    return false;
  }
}
