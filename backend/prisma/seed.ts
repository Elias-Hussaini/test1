/**
 * Seed script — برای پر کردن دیتابیس با چند لغت اولیه.
 * فقط برای development — در production اجرا نشود.
 *
 * اجرا: npx prisma db seed
 */
import { PrismaClient } from "@prisma/client";

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
  { german: " essen", persian: "خوردن", article: null, partOfSpeech: "Verb", level: "A1", example: "Wir essen zusammen.", exampleFa: "ما با هم غذا می‌خوریم." },
];

async function main() {
  console.log("🌱 Seeding database...");

  // پاک‌سازی
  await prisma.userWord.deleteMany();
  await prisma.word.deleteMany();

  // ساخت لغات
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

  console.log(`✅ Seeded ${words.length} words.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
