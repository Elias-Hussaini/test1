/** کلید ذخیره‌ی تم در localStorage؛ هم اسکریپت اولیه و هم ThemeToggle از همین استفاده می‌کنند. */
export const THEME_STORAGE_KEY = "lingo-theme";

/**
 * اسکریپت اولیه‌ی تم — قبل از اولین رنگ‌آمیزی صفحه اجرا می‌شود تا پرش رنگ ایجاد نشود.
 * ترتیب انتخاب: ۱) انتخاب ذخیره‌شده‌ی کاربر  ۲) ترجیح سیستم‌عامل  ۳) روشن.
 */
export const themeInitScript = `(function(){var r=document.documentElement,d=null;try{var s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(s==="dark")d=true;else if(s==="light")d=false}catch(e){}if(d===null){d=!!(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)}r.classList.toggle("dark",d)})();`;
