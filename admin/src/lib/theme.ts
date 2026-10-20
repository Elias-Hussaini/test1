export const THEME_STORAGE_KEY = "lingo-admin-theme";

/**
 * اسکریپت اولیه‌ی تم — قبل از اولین رنگ‌آمیزی صفحه اجرا می‌شود تا پرش رنگ ایجاد نشود.
 * ترتیب انتخاب: ۱) انتخاب ذخیره‌شده‌ی کاربر  ۲) ترجیح سیستم‌عامل  ۳) تاریک (هویت LINGO).
 */
export const themeInitScript = `(function(){var r=document.documentElement,d=null;try{var s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(s==="dark")d=true;else if(s==="light")d=false}catch(e){}if(d===null){d=!(window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches)}r.classList.toggle("dark",d)})();`;

export type ThemeName = "light" | "dark";

export function currentTheme(): ThemeName {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyTheme(theme: ThemeName): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* حالت خصوصی؛ تم فقط برای همین بازدید اعمال می‌شود */
  }
}

export function toggleTheme(): ThemeName {
  const next: ThemeName = currentTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}
