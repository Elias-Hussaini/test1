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
├── src/
│   ├── app/
│   │   ├── layout.tsx       ← RTL + theme init
│   │   ├── page.tsx         ← Main app (login/dashboard/users/...)
│   │   └── globals.css      ← Design System
│   ├── hooks/
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── api.ts           ← API client (auth, users, dictionary)
│   │   ├── admin-store.ts   ← Zustand (auth state)
│   │   ├── theme.ts         ← Theme init script
│   │   └── utils.ts         ← cn() helper
│   ├── components/
│   │   ├── ui/              ← shadcn/ui components
│   │   ├── admin/           ← Admin-specific components
│   │   │   ├── admin-login.tsx
│   │   │   ├── admin-sidebar.tsx
│   │   │   ├── admin-topbar.tsx
│   │   │   ├── logo.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   ├── badges.tsx
│   │   │   └── views/
│   │   │       ├── dashboard-view.tsx
│   │   │       ├── users-view.tsx
│   │   │       ├── user-detail-view.tsx
│   │   │       └── dictionary-view.tsx
│   └── types/
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── components.json
```

## 🎨 Design System

- **Primary**: `#7567F8`
- **Secondary**: `#28C7E8`
- **Accent**: `#A78BFA`
- **تم روشن**: پس‌زمینه `#F6F7FC`، متن `#191B2A`
- **تم تاریک**: پس‌زمینه `#0D1020`، متن `#F5F6FF`
- **فونت**: Vazirmatn (RTL)
- **Glassmorphism**: فقط sidebar و modals
