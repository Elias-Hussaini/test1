import { Resend } from "resend";
import { env } from "../config/env.js";

/**
 * سرویس ایمیل (Resend).
 *
 * - اگر RESEND_API_KEY تنظیم نشده باشد (dev)، متن ایمیل — شامل کد — در ترمینال سرور چاپ می‌شود.
 * - در production بدون کلید، ارسال شکست می‌خورد و خطا لاگ می‌شود (کد هرگز چاپ نمی‌شود).
 *
 * نکته‌ی Resend: `EMAIL_FROM` باید از دامنه‌ای باشد که در Resend تأیید کرده‌ای.
 * برای تست بدون دامنه از `LINGO <onboarding@resend.dev>` استفاده کن؛ در این حالت
 * ایمیل فقط به آدرس خودِ صاحب حساب Resend ارسال می‌شود.
 */

const apiKey = env.RESEND_API_KEY?.trim();
const resend = apiKey && apiKey !== "re_xxx" ? new Resend(apiKey) : null;

export type EmailTemplate = {
  to: string;
  subject: string;
  html: string;
  /** نسخه‌ی متنی؛ برای کلاینت‌های ساده و بهبود deliverability */
  text: string;
};

/**
 * ارسال ایمیل. هیچ‌وقت throw نمی‌کند؛ نتیجه‌ی true/false برمی‌گرداند
 * تا شکست ایمیل، درخواست اصلی (مثلاً ثبت‌نام) را نشکند.
 */
export async function sendEmail(template: EmailTemplate): Promise<boolean> {
  if (!resend) {
    if (env.NODE_ENV === "production") {
      console.error("[EMAIL_ERROR] RESEND_API_KEY تنظیم نشده؛ ایمیل ارسال نشد.");
      return false;
    }
    console.log("\n  ┌─ [DEV EMAIL] ─────────────────────────");
    console.log(`  │ To:      ${template.to}`);
    console.log(`  │ Subject: ${template.subject}`);
    console.log("  │");
    for (const line of template.text.split("\n")) console.log(`  │ ${line}`);
    console.log("  └───────────────────────────────────────\n");
    return true;
  }

  try {
    const { error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: template.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (error) {
      // رایج‌ترین دلیل: دامنه‌ی EMAIL_FROM تأیید نشده، یا ارسال به آدرسی غیر از صاحب حساب با onboarding@resend.dev
      console.error(`[EMAIL_ERROR] ${error.name}: ${error.message}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[EMAIL_ERROR]", err instanceof Error ? err.message : err);
    return false;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** قالب مشترک ایمیل‌های کد یک‌بارمصرف. */
function otpHtml(params: { greeting: string; title: string; lead: string; code: string; footnote: string }): string {
  const { greeting, title, lead, code, footnote } = params;
  const digits = code
    .split("")
    .map(
      (d) =>
        `<td style="width:44px;height:56px;text-align:center;background:#ffffff;border:2px solid #7567F8;border-radius:12px;font-size:28px;font-weight:900;color:#4B3FD1;font-family:Consolas,Menlo,monospace;">${d}</td>`,
    )
    .join('<td style="width:6px;"></td>');

  return `<!doctype html>
<html lang="fa" dir="rtl">
  <body style="margin:0;padding:24px 12px;background:#F1F2F8;font-family:Tahoma,Vazirmatn,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #E5E7EF;">
      <div style="padding:28px 24px;background:#191F34;text-align:center;">
        <div style="display:inline-block;width:52px;height:52px;line-height:52px;border-radius:16px;background:linear-gradient(135deg,#7567F8,#28C7E8);color:#fff;font-size:26px;font-weight:900;">L</div>
        <p style="margin:14px 0 0;color:#A78BFA;font-size:13px;letter-spacing:3px;" dir="ltr">${escapeHtml(greeting)}</p>
      </div>
      <div style="padding:28px 24px;text-align:center;">
        <h1 style="margin:0 0 8px;color:#191B2A;font-size:22px;">${escapeHtml(title)}</h1>
        <p style="margin:0 0 24px;color:#777D93;font-size:14px;line-height:1.9;">${lead}</p>
        <table role="presentation" dir="ltr" align="center" style="border-collapse:separate;margin:0 auto 24px;"><tr>${digits}</tr></table>
        <p style="margin:0;color:#777D93;font-size:12px;line-height:1.9;">${footnote}</p>
      </div>
      <div style="padding:14px 24px;border-top:1px solid #E5E7EF;text-align:center;color:#9AA0B4;font-size:11px;">© ${new Date().getFullYear()} LINGO</div>
    </div>
  </body>
</html>`;
}

export function emailVerificationTemplate(code: string, email: string, username?: string): EmailTemplate {
  const name = username ? escapeHtml(username) : "";
  return {
    to: email,
    subject: `کد تأیید LINGO: ${code}`,
    html: otpHtml({
      greeting: "HALLO!",
      title: "ایمیلت را تأیید کن",
      lead: `${name ? `سلام ${name}! ` : ""}این کد را در LINGO وارد کن تا حسابت فعال شود.`,
      code,
      footnote: "این کد تا ۱۰ دقیقه معتبر است و فقط یک بار کار می‌کند.<br/>اگر خودت ثبت‌نام نکرده‌ای، این ایمیل را نادیده بگیر.",
    }),
    text: [
      `سلام${username ? ` ${username}` : ""}!`,
      `کد تأیید ایمیل LINGO: ${code}`,
      "این کد تا ۱۰ دقیقه معتبر است. اگر خودت ثبت‌نام نکرده‌ای، این ایمیل را نادیده بگیر.",
    ].join("\n"),
  };
}

export function passwordResetTemplate(code: string, email: string): EmailTemplate {
  return {
    to: email,
    subject: `کد بازیابی رمز LINGO: ${code}`,
    html: otpHtml({
      greeting: "PASSWORT VERGESSEN?",
      title: "بازیابی رمز عبور",
      lead: "برای انتخاب رمز جدید این کد را در LINGO وارد کن.",
      code,
      footnote: "این کد تا ۱۰ دقیقه معتبر است و فقط یک بار کار می‌کند.<br/>اگر خودت درخواست نکرده‌ای، چیزی لازم نیست انجام بدهی؛ رمزت تغییر نمی‌کند.",
    }),
    text: [
      `کد بازیابی رمز LINGO: ${code}`,
      "این کد تا ۱۰ دقیقه معتبر است. اگر خودت درخواست نکرده‌ای، این ایمیل را نادیده بگیر؛ رمزت تغییر نمی‌کند.",
    ].join("\n"),
  };
}
