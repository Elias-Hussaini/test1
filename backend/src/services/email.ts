import { Resend } from "resend";
import { env } from "../config/env.js";

/**
 * Email Service — با Resend
 * اگه RESEND_API_KEY تنظیم نباشه، کد تأیید در لاگ سرور چاپ می‌شه (dev mode).
 */
const resend = env.RESEND_API_KEY && env.RESEND_API_KEY !== "re_xxx"
  ? new Resend(env.RESEND_API_KEY)
  : null;

export type EmailTemplate = {
  to: string;
  subject: string;
  html: string;
};

/**
 * ارسال ایمیل.
 * در محیط development اگه Resend تنظیم نباشه، فقط در لاگ چاپ می‌شه.
 */
export async function sendEmail(template: EmailTemplate): Promise<boolean> {
  if (!resend) {
    // Dev mode — فقط چاپ کن
    console.log("\n  [DEV EMAIL]");
    console.log(`   To: ${template.to}`);
    console.log(`   Subject: ${template.subject}`);
    console.log(`   --- HTML (first 300) ---`);
    console.log(template.html.slice(0, 300));
    console.log(`   --- END ---\n`);
    return true;
  }

  try {
    const { error } = await resend.emails.send({
      from: env.EMAIL_FROM || "LINGO <noreply@lingo.app>",
      to: template.to,
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error("[EMAIL_ERROR]", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[EMAIL_ERROR]", err);
    return false;
  }
}

/**
 * قالب ایمیل تأیید ایمیل.
 */
export function emailVerificationTemplate(
  code: string,
  email: string,
  username?: string,
): EmailTemplate {
  return {
    to: email,
    subject: `LINGO — کد تأیید ایمیل: ${code}`,
    html: `
      <div dir="rtl" style="font-family: Vazirmatn, Tahoma, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #F6F7FC; border-radius: 20px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: linear-gradient(135deg, #7567F8, #28C7E8); border-radius: 16px; color: white; font-size: 28px; font-weight: 900;">L</div>
          <h1 style="color: #191B2A; font-size: 24px; margin: 16px 0 8px;">تأیید ایمیل</h1>
          <p style="color: #777D93; margin: 0;">سلام ${username ?? ""}، کد تأیید شما:</p>
        </div>
        <div style="text-align: center; margin: 24px 0;">
          <div style="display: inline-block; padding: 16px 32px; background: white; border: 2px solid #7567F8; border-radius: 16px;">
            <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #7567F8; font-family: monospace;">${code}</span>
          </div>
        </div>
        <p style="color: #777D93; font-size: 13px; text-align: center; margin-top: 24px;">
          این کد تا ۱۰ دقیقه معتبر است.<br/>
          اگه شما این درخواست را نداده‌اید، این ایمیل را نادیده بگیرید.
        </p>
        <hr style="border: none; border-top: 1px solid #E5E7EF; margin: 24px 0;" />
        <p style="color: #777D93; font-size: 11px; text-align: center;">
          © ${new Date().getFullYear()} LINGO
        </p>
      </div>
    `,
  };
}

/**
 * قالب ایمیل بازیابی رمز عبور.
 */
export function passwordResetTemplate(code: string, email: string): EmailTemplate {
  return {
    to: email,
    subject: `LINGO — کد بازیابی رمز عبور: ${code}`,
    html: `
      <div dir="rtl" style="font-family: Vazirmatn, Tahoma, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #F6F7FC; border-radius: 20px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: linear-gradient(135deg, #7567F8, #28C7E8); border-radius: 16px; color: white; font-size: 28px; font-weight: 900;">L</div>
          <h1 style="color: #191B2A; font-size: 24px; margin: 16px 0 8px;">بازیابی رمز عبور</h1>
          <p style="color: #777D93; margin: 0;">درخواست بازیابی رمز برای حساب شما ثبت شد.</p>
        </div>
        <div style="text-align: center; margin: 24px 0;">
          <div style="display: inline-block; padding: 16px 32px; background: white; border: 2px solid #7567F8; border-radius: 16px;">
            <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #7567F8; font-family: monospace;">${code}</span>
          </div>
        </div>
        <p style="color: #777D93; font-size: 13px; text-align: center; margin-top: 24px;">
          این کد تا ۱۰ دقیقه معتبر است.<br/>
          اگه شما این درخواست را نداده‌اید، رمز عبور شما تغییر نخواهد کرد.
        </p>
        <hr style="border: none; border-top: 1px solid #E5E7EF; margin: 24px 0;" />
        <p style="color: #777D93; font-size: 11px; text-align: center;">
          © ${new Date().getFullYear()} LINGO
        </p>
      </div>
    `,
  };
}
