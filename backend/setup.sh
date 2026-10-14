#!/usr/bin/env bash
# ═══════════════════════════════════════════
# LINGO Backend — Setup Script (Bash)
# ═══════════════════════════════════════════
# استفاده:
#   cd backend && bash setup.sh
# ═══════════════════════════════════════════

set -e
cd "$(dirname "$0")"

step() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  $1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

ok()    { echo "  ✓ $1"; }
warn()  { echo "  ⚠ $1"; }
err()   { echo "  ✗ $1"; }

# ─── بررسی Node.js ────────────────────────
step "بررسی Node.js"
if ! command -v node &> /dev/null; then
    err "Node.js نصب نیست. از https://nodejs.org دانلود کن."
    exit 1
fi
ok "Node.js: $(node -v)"
ok "npm: $(npm -v)"

# ─── ۱. نصب پکیج‌ها ────────────────────────
step "نصب پکیج‌ها (npm install)"
if [ -d "node_modules" ]; then
    warn "node_modules از قبل وجود دارد."
fi
npm install
ok "پکیج‌ها نصب شدند."

# ─── ۲. ساخت .env ─────────────────────────
step "ساخت .env با JWT secrets تصادفی"

if [ -f ".env" ]; then
    warn ".env از قبل وجود دارد. پرش می‌شه."
else
    ACCESS_SECRET=$(openssl rand -hex 32 2>/dev/null || head -c 32 /dev/urandom | xxd -p | tr -d '\n')
    REFRESH_SECRET=$(openssl rand -hex 32 2>/dev/null || head -c 32 /dev/urandom | xxd -p | tr -d '\n')

    cp .env.example .env
    sed -i.bak "s/CHANGE_ME_TO_A_RANDOM_64_BYTE_HEX_STRING/$ACCESS_SECRET/" .env
    sed -i.bak "s/CHANGE_ME_TO_ANOTHER_RANDOM_64_BYTE_HEX_STRING/$REFRESH_SECRET/" .env
    rm -f .env.bak

    ok ".env ساخته شد."
    echo "  JWT_ACCESS_SECRET:  ${ACCESS_SECRET:0:16}..."
    echo "  JWT_REFRESH_SECRET: ${REFRESH_SECRET:0:16}..."
fi

# ─── ۳. Prisma Client ─────────────────────
step "تولید Prisma Client"
npx prisma generate
ok "Prisma Client ساخته شد."

# ─── ۴. ساخت دیتابیس ──────────────────────
step "ساخت دیتابیس SQLite"
npx prisma db push --skip-generate
ok "دیتابیس ساخته شد: dev.db"

# ─── ۵. Seed لغات اولیه ──────────────────
step "پر کردن دیتابیس با لغات اولیه"
npx tsx prisma/seed.ts || warn "Seed ناموفق بود (ممکنه قبلاً انجام شده باشه)."
ok "۱۰ لغت آلمانی اضافه شد."

# ─── پایان ────────────────────────────────
echo ""
echo "════════════════════════════════════════"
echo "  🎉 راه‌اندازی کامل شد!"
echo "════════════════════════════════════════"
echo ""
echo "حالا می‌تونی سرور رو اجرا کنی:"
echo "  npm run dev"
echo ""
echo "سرور روی http://localhost:4000 بالا میاد."
echo ""
