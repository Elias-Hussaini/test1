# LINGO Admin Panel

پنل مدیریت LINGO — Next.js + TypeScript + Tailwind CSS 4 + shadcn/ui

## 🚀 اجرا روی سیستم محلی

### پیش‌نیازها

۱. **بک‌اند LINGO** باید روی `http://localhost:4000` در حال اجرا باشه.
   (اگه بک‌اند رو نداری، اول به پوشه‌ی `../backend/` برو و `setup.ps1` رو اجرا کن.)

۲. **Node.js 18+** و **npm** نصب باشن.

### نصب و اجرا

```powershell
# به پوشه‌ی admin برو
cd admin

# نصب پکیج‌ها
npm install

# اجرای سرور توسعه
npm run dev
```

سرور روی `http://localhost:3001` بالا میاد.

### ورود به پنل

مرورگر رو باز کن و برو به: **http://localhost:3001**

اعتبارنامه‌ی ادمین:
- ایمیل: `admin@lingo.app`
- رمز عبور: `Lingo@Admin2026`

### اتصال به بک‌اند

پنل به‌صورت پیش‌فرض به `http://localhost:4000` وصل می‌شه.
اگه بک‌اند روی آدرس دیگه‌ای هست، متغیر `NEXT_PUBLIC_API_URL` رو توی فایل `.env.local` ست کن:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 📁 ساختار

```
admin/
├── public/fonts/               ← Vazirmatn (لوکال، بدون وابستگی به CDN)
└── src/
    ├── app/
    │   ├── layout.tsx          ← RTL، فونت، اسکریپت تم
    │   ├── login/page.tsx      ← ورود
    │   └── (panel)/            ← همه‌ی صفحات پشت گارد ادمین
    │       ├── layout.tsx      ← AdminShell (گارد + سایدبار + نوار بالا)
    │       ├── page.tsx        ← داشبورد (/)
    │       ├── users/          ← فهرست (/users) و جزئیات (/users/[id])
    │       ├── dictionary/     ← واژه‌نامه
    │       └── settings/       ← حساب، تم، وضعیت بک‌اند
    ├── components/
    │   ├── ui/                 ← dialog, dropdown-menu, toast (shadcn)
    │   └── admin/
    │       ├── common/         ← Button/فیلدها، حالت‌ها، صفحه‌بندی، تأیید
    │       ├── views/          ← محتوای هر صفحه
    │       └── ...             ← shell, sidebar, topbar, login-form
    ├── hooks/                  ← useApi, useDebouncedValue, useToast
    └── lib/
        ├── api.ts              ← کلاینت API (refresh خودکار و تک‌درخواستی)
        ├── token-store.ts      ← access در حافظه، refresh در sessionStorage
        ├── session-store.ts    ← وضعیت نشست (بدون persist)
        ├── format.ts           ← عدد و تاریخ فارسی
        └── theme.ts            ← تم روشن/تاریک
```

### نکات امنیتی

- access token فقط در حافظه‌ی JS است و refresh token در `sessionStorage` (با بستن تب پاک می‌شود)؛ هیچ توکنی در `localStorage` نیست.
- گارد صفحه‌ها فقط تجربه‌ی کاربری است. امنیت واقعی سمت بک‌اند است: هر endpoint ادمین نقش را چک می‌کند.
- راه‌حل نهایی برای توکن‌ها کوکی HttpOnly است (نیاز به تغییر در بک‌اند).

## 🎨 Design System

- **Primary**: `#7567F8`
- **Secondary**: `#28C7E8`
- **Accent**: `#A78BFA`
- **تم روشن**: پس‌زمینه `#F6F7FC`، متن `#191B2A`
- **تم تاریک**: پس‌زمینه `#0D1020`، متن `#F5F6FF`
- **فونت**: Vazirmatn (RTL)
- **Glassmorphism**: فقط sidebar و modals
