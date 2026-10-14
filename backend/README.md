# LINGO Backend

API واقعی برای پلتفرم آموزش زبان آلمانی LINGO.

## 🚀 شروع سریع

```bash
# 1. نصب پکیج‌ها
npm install

# 2. کپی فایل env
cp .env.example .env

# 3. تولید Prisma Client
npx prisma generate

# 4. ساخت دیتابیس SQLite و schema
npx prisma db push

# 5. (اختیاری) پر کردن با داده‌ی اولیه
npx prisma db seed

# 6. اجرای سرور
npm run dev
```

سرور روی `http://localhost:4000` بالا می‌آید.

## 📡 API Endpoints

### Health
- `GET /api/health` — بررسی سلامت سرور

### Auth (`/api/auth`)
- `POST /api/auth/register` — ثبت‌نام `{ email, password, username, firstName?, lastName? }`
- `POST /api/auth/login` — ورود `{ email, password }`
- `POST /api/auth/refresh` — تجدید توکن `{ refreshToken? }` یا از cookie
- `POST /api/auth/logout` — خروج `{ refreshToken? }` یا از cookie
- `GET /api/auth/me` — اطلاعات کاربر فعلی (نیاز به Bearer token)

### Users (`/api/users`)
- `GET /api/users/me` — آمار کاربر فعلی
- `PATCH /api/users/me/profile` — به‌روزرسانی پروفایل
- `GET /api/users/:id` — پروفایل عمومی کاربر

### Admin Users (`/api/admin/users`)
- `GET /api/admin/users` — لیست کاربران (با فیلتر و pagination)
- `PATCH /api/admin/users/:id` — تغییر نقش/وضعیت کاربر

### Dictionary (`/api/dictionary`)
- `GET /api/dictionary/search?q=&level=&article=&page=&limit=` — جستجو
- `GET /api/dictionary/word/:id` — یک واژه

### Admin Dictionary (`/api/admin/dictionary`)
- `POST /api/admin/dictionary` — ساخت واژه
- `PATCH /api/admin/dictionary/:id` — ویرایش
- `DELETE /api/admin/dictionary/:id` — حذف

### Vocabulary (`/api/vocabulary`)
- `GET /api/vocabulary?status=&level=&page=&limit=` — لیست واژه‌های ذخیره‌شده
- `POST /api/vocabulary` — افزودن واژه `{ wordId, status? }`
- `PATCH /api/vocabulary/:wordId` — تغییر وضعیت `{ status }`
- `DELETE /api/vocabulary/:wordId` — حذف واژه
- `GET /api/vocabulary/stats` — آمار

## 🔐 امنیت

- **Password**: bcrypt با cost 12
- **Access Token**: 15 دقیقه، در memory سمت کلاینت
- **Refresh Token**: 7 روز، در HttpOnly Cookie، ذخیره‌شده در DB برای قابلیت revoke
- **Token Rotation**: در هر refresh، refresh token قبلی revoke می‌شود
- **Rate Limiting**: 5 درخواست در دقیقه برای `/api/auth/*`، 100 برای بقیه
- **CORS**: فقط از منابع مجاز در env
- **Helmet**: هدرهای امنیتی
- **Validation**: همه‌ی ورودی‌ها با Zod اعتبارسنجی می‌شوند

## 🗄️ دیتابیس

- **Dev**: SQLite (`prisma/dev.db`)
- **Prod**: PostgreSQL — کافی است `provider` را در `schema.prisma` تغییر دهید و `DATABASE_URL` را تنظیم کنید.

مدل‌ها: `User`, `Profile`, `Session`, `RefreshToken`, `Word`, `UserWord`

## 📁 ساختار

```
backend/
├── prisma/
│   ├── schema.prisma        ← مدل‌های داده
│   └── seed.ts              ← داده‌ی اولیه
├── src/
│   ├── config/env.ts        ← اعتبارسنجی env
│   ├── database/client.ts   ← Prisma singleton
│   ├── utils/
│   │   ├── password.ts      ← bcrypt
│   │   ├── jwt.ts           ← توکن‌ها
│   │   └── response.ts      ← فرمت استاندارد پاسخ
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── modules/
│   │   ├── auth/            ← ثبت‌نام، ورود، refresh، logout
│   │   ├── users/           ← پروفایل، آمار، مدیریت کاربران
│   │   ├── dictionary/      ← جستجو و مدیریت لغات
│   │   └── vocabulary/      ← واژه‌نامه‌ی شخصی کاربر
│   └── server.ts            ← Bootstrap Fastify
├── .env.example
├── package.json
└── tsconfig.json
```

## 🛠️ اسکریپت‌ها

| دستور | توضیح |
|------|------|
| `npm run dev` | اجرای سرور در حالت توسعه (با Hot Reload) |
| `npm run build` | کامپایل TypeScript |
| `npm start` | اجرای نسخه‌ی build‌شده |
| `npm run typecheck` | بررسی تایپ‌ها |
| `npm run db:push` | اعمال schema روی دیتابیس |
| `npm run db:generate` | تولید مجدد Prisma Client |
| `npm run db:migrate` | ساخت migration |
| `npm run db:studio` | باز کردن Prisma Studio |
| `npm run db:seed` | پر کردن دیتابیس با داده‌ی اولیه |
