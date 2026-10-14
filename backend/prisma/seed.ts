/**
 * Seed script — پر کردن دیتابیس با داده‌ی اولیه.
 * ۱۰ لغت آلمانی نمونه + ۱ کاربر ادمین پیش‌فرض.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const words = [
  { german: "Haus", persian: "خانه", article: "das", plural: "Häuser", partOfSpeech: "Noun", level: "A1", example: "Das Haus ist groß.", exampleFa: "خانه بزرگ است." },
  { german: "Schule", persian: "مدرسه", article: "die", plural: "Schulen", partOfSpeech: "Noun", level: "A1", example: "Ich gehe zur Schule.", exampleFa: "من به مدرسه می‌روم." },
  { german: "Buch", persian: "کتاب", article: "das", plural: "Bücher", partOfSpeech: "Noun", level: "A1", example: "Das Buch ist interessant.", exampleFa: "کتاب جالب است." },
  { german: "Freund", persian: "دوست", article: "der", plural: "Freunde", partOfSpeech: "Noun", level: "A2", example: "Er ist mein Freund.", exampleFa: "او دوست من است." },
  { german: "Sprache", persian: "زبان", article: "die", plural: "Sprachen", partOfSpeech: "Noun", level: "A1", example: "Deutsch ist eine schöne Sprache.", exampleFa: "آلمانی یک زبان زیباست." },
  { german: "gehen", persian: "رفتن", article: null, partOfSpeech: "Verb", level: "A1", example: "Ich gehe nach Hause.", exampleFa: "من به خانه می‌روم." },
  { german: "schön", persian: "زیبا", article: null, partOfSpeech: "Adjective", level: "A2", example: "Das Wetter ist schön.", exampleFa: "هوا زیباست." },
  { german: "Lehrer", persian: "معلم", article: "der", plural: "Lehrer", partOfSpeech: "Noun", level: "A2", example: "Der Lehrer ist nett.", exampleFa: "معلم مهربان است." },
  { german: "Wasser", persian: "آب", article: "das", partOfSpeech: "Noun", level: "A1", example: "Ich trinke Wasser.", exampleFa: "من آب می‌نوشم." },
  { german: "essen", persian: "خوردن", article: null, partOfSpeech: "Verb", level: "A1", example: "Wir essen zusammen.", exampleFa: "ما با هم غذا می‌خوریم." },
];

async function main() {
  console.log("🌱 Seeding database...");

  // پاک‌سازی
  await prisma.userWord.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.word.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // ─── ساخت ادمین پیش‌فرض ───────────────
  const adminPassword = await bcrypt.hash("Lingo@Admin2026", 12);
  const admin = await prisma.user.create({
    data: {
      email: "admin@lingo.app",
      username: "admin",
      passwordHash: adminPassword,
      role: "admin",
      status: "active",
      isEmailVerified: true,
      profile: {
        create: {
          firstName: "مدیر",
          lastName: "سیستم",
          level: "C2",
        },
      },
    },
  });
  console.log(`✅ Admin user created: ${admin.email} (password: Lingo@Admin2026)`);

  // ─── ساخت چند کاربر نمونه ─────────────
  const sampleUsers = [
    { email: "ahmad@example.com", username: "ahmad", firstName: "احمد", lastName: "حسینی", level: "A1" },
    { email: "maryam@example.com", username: "maryam", firstName: "مریم", lastName: "محمدی", level: "A2" },
    { email: "ali@example.com", username: "ali", firstName: "علی", lastName: "رضایی", level: "B1" },
  ];
  for (const su of sampleUsers) {
    const pwd = await bcrypt.hash("User1234", 12);
    await prisma.user.create({
      data: {
        email: su.email,
        username: su.username,
        passwordHash: pwd,
        role: "user",
        status: "active",
        profile: {
          create: {
            firstName: su.firstName,
            lastName: su.lastName,
            level: su.level,
          },
        },
      },
    });
  }
  console.log(`✅ ${sampleUsers.length} sample users created.`);

  // ─── ساخت لغات ───────────────────────
  for (const w of words) {
    await prisma.word.create({
      data: {
        german: w.german.trim(),
        persian: w.persian,
        article: w.article,
        plural: w.plural ?? null,
        partOfSpeech: w.partOfSpeech,
        level: w.level,
        example: w.example,
        exampleFa: w.exampleFa,
      },
    });
  }
  console.log(`✅ ${words.length} words seeded.`);

  console.log("\n📋 Login credentials:");
  console.log("   Admin:  admin@lingo.app / Lingo@Admin2026");
  console.log("   User:   ahmad@example.com / User1234");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
