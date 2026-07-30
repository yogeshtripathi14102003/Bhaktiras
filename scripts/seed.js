/**
 * Seed script — populates MongoDB with starter content so every page
 * has real data to render instead of the demo/sample content in
 * lib/sampleData.js.
 *
 * Usage:
 *   npm run seed
 *
 * Requires MONGODB_URI in .env (see .env.example).
 */

require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  const Category = require("../models/Category").default || require("../models/Category");
  const Bhajan = require("../models/Bhajan").default || require("../models/Bhajan");
  const Katha = require("../models/Katha").default || require("../models/Katha");
  const Saint = require("../models/Saint").default || require("../models/Saint");
  const Blog = require("../models/Blog").default || require("../models/Blog");
  const Festival = require("../models/Festival").default || require("../models/Festival");
  const Quote = require("../models/Quote").default || require("../models/Quote");
  const User = require("../models/User").default || require("../models/User");
  const Settings = require("../models/Settings").default || require("../models/Settings");

  await Promise.all([
    Category.deleteMany({}), Bhajan.deleteMany({}), Katha.deleteMany({}),
    Saint.deleteMany({}), Blog.deleteMany({}), Festival.deleteMany({}),
    Quote.deleteMany({}), Settings.deleteMany({}),
  ]);

  const bhajanCategory = await Category.create({ name: "Krishna Bhajan", slug: "krishna-bhajan", type: "bhajan" });
  const kathaCategory = await Category.create({ name: "Bhagwat Katha", slug: "bhagwat-katha", type: "katha" });
  const blogCategory = await Category.create({ name: "Braj Culture", slug: "braj-culture", type: "blog" });

  await Bhajan.create({
    title: "Shyam Teri Bansi Pukare Radha Naam",
    slug: "shyam-teri-bansi",
    singer: "Anuradha Paudwal",
    category: bhajanCategory._id,
    lyrics: "Shyam teri bansi pukare Radha naam...",
    status: "published",
  });

  await Katha.create({
    title: "Shrimad Bhagwat Katha - Din 1: Mangalacharan",
    slug: "bhagwat-katha-din-1",
    category: kathaCategory._id,
    speaker: { name: "Pujya Morari Bapu" },
    videoUrl: "https://www.youtube.com/watch?v=example",
    status: "published",
  });

  await Saint.create({
    name: "Sri Chaitanya Mahaprabhu",
    slug: "chaitanya-mahaprabhu",
    era: "15th century",
    biography: "A saint revered across Bengal and Braj for spreading sankirtan.",
    status: "published",
  });

  await Blog.create({
    title: "Why Vrindavan is Called the Land of Divine Love",
    slug: "vrindavan-land-of-divine-love",
    excerpt: "Explore why every lane of Braj carries the fragrance of Radha-Krishna's eternal leela.",
    content: "<p>Full article content goes here...</p>",
    category: blogCategory._id,
    readTime: 6,
    status: "published",
    publishedAt: new Date(),
  });

  await Festival.create({
    name: "Radhashtami",
    slug: "radhashtami",
    date: new Date("2026-09-19"),
    mantra: "Om Shreem Radhikayai Namah",
    status: "published",
  });

  await Quote.create({
    text: "Where there is Radha, there is Krishna; where there is Krishna, there is Radha.",
    author: "Traditional Vaishnav teaching",
    scheduledFor: new Date(),
  });

  const adminEmail = "adminkishoribhakti@gmail.com";
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: "Admin",
      email: adminEmail,
      password: await bcrypt.hash("ChangeMe123!", 10),
      role: "admin",
      isVerified: true,
    });
    console.log(`Admin user created: ${adminEmail} / ChangeMe123! (change this immediately)`);
  }

  await Settings.create({ key: "site", siteName: "Kishori Bhakti", contactEmail: "seva@kishoribhakti.org" });

  console.log("Seed complete.");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});