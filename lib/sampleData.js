/**
 * Demo content for the homepage and listing pages.
 *
 * This lets the site render a complete, realistic preview without a
 * MongoDB connection configured. Once MONGODB_URI is set (see
 * .env.example) and you've run `npm run seed`, swap these imports for
 * real queries — every section below has a matching Mongoose model
 * (in models/) and API route (in app/api/) already built.
 *
 * Example swap in a server component:
 *   // const bhajans = SAMPLE_BHAJANS
 *   const bhajans = await Bhajan.find({ status: "published" }).limit(6);
 */

export const SAMPLE_BHAJANS = [
  { _id: "1", title: "Shyam Teri Bansi Pukare Radha Naam", slug: "shyam-teri-bansi", singer: "Anuradha Paudwal", thumbnail: "bhajan1", duration: 312, category: { name: "Krishna Bhajan" } },
  { _id: "2", title: "Kishori Ke Charno Ki Dasi Banade", slug: "kishori-charno-dasi", singer: "Jai Shankar Choudhary", thumbnail: "bhajan2", duration: 274, category: { name: "Radha Bhajan" } },
  { _id: "3", title: "Braj Ki Kunj Galiyan", slug: "braj-kunj-galiyan", singer: "Lakhbir Singh Lakkha", thumbnail: "bhajan3", duration: 298, category: { name: "Braj Bhajan" } },
  { _id: "4", title: "Radhe Radhe Bol Man Mera", slug: "radhe-radhe-bol", singer: "Sanjeevani Bhelande", thumbnail: "bhajan4", duration: 260, category: { name: "Radha Bhajan" } },
];

export const SAMPLE_KATHAS = [
  { _id: "1", title: "Shrimad Bhagwat Katha - Din 1: Mangalacharan", slug: "bhagwat-katha-din-1", speaker: { name: "Pujya Morari Bapu", photo: "speaker1" }, thumbnail: "katha1", views: 48210, duration: 5400 },
  { _id: "2", title: "Radha Kishori Prakatya Leela", slug: "radha-kishori-prakatya", speaker: { name: "Devkinandan Thakur Ji", photo: "speaker2" }, thumbnail: "katha2", views: 91032, duration: 4820 },
  { _id: "3", title: "Braj Ras Katha - Nidhivan Rahasya", slug: "braj-ras-nidhivan", speaker: { name: "Premanand Govind Sharan", photo: "speaker3" }, thumbnail: "katha3", views: 62330, duration: 5100 },
];

export const SAMPLE_SAINTS = [
  { _id: "1", name: "Sri Chaitanya Mahaprabhu", slug: "chaitanya-mahaprabhu", era: "15th century", photo: "saint1" },
  { _id: "2", name: "Sri Hit Harivansh Mahaprabhu", slug: "hit-harivansh-mahaprabhu", era: "16th century", photo: "saint2" },
  { _id: "3", name: "Sri Surdas Ji", slug: "surdas-ji", era: "16th century", photo: "saint3" },
  { _id: "4", name: "Sri Meera Bai", slug: "meera-bai", era: "16th century", photo: "saint4" },
];

export const SAMPLE_BLOGS = [
  { _id: "1", title: "Why Vrindavan is Called the Land of Divine Love", slug: "vrindavan-land-of-divine-love", excerpt: "Explore why every lane of Braj carries the fragrance of Radha-Krishna's eternal leela.", coverImage: "blog1", category: { name: "Braj Culture" }, readTime: 6 },
  { _id: "2", title: "The Significance of Kishori Ji in Vaishnav Tradition", slug: "significance-of-kishori-ji", excerpt: "Understanding Radha Rani's place at the heart of Gaudiya devotion.", coverImage: "blog2", category: { name: "Spiritual" }, readTime: 5 },
  { _id: "3", title: "5 Lesser-Known Temples of Barsana", slug: "temples-of-barsana", excerpt: "Beyond Radha Rani Temple — hidden gems every Braj pilgrim should visit.", coverImage: "blog3", category: { name: "Pilgrimage" }, readTime: 8 },
];

export const SAMPLE_FESTIVALS = [
  { _id: "1", name: "Radhashtami", slug: "radhashtami", date: "2026-09-19", banner: "festival1", mantra: "Om Shreem Radhikayai Namah" },
  { _id: "2", name: "Janmashtami", slug: "janmashtami", date: "2026-08-15", banner: "festival2", mantra: "Om Namo Bhagavate Vasudevaya" },
  { _id: "3", name: "Sharad Purnima", slug: "sharad-purnima", date: "2026-10-25", banner: "festival3", mantra: "Om Kleem Krishnaya Namah" },
];

export const SAMPLE_EVENTS = [
  { _id: "1", title: "Barsana Holi Yatra 2026", slug: "barsana-holi-yatra-2026", venue: "Barsana, Uttar Pradesh", startDate: "2027-03-02", banner: "event1", isFree: false, price: 1500 },
  { _id: "2", title: "Vrindavan Katha Sammelan", slug: "vrindavan-katha-sammelan", venue: "Vrindavan Chandrodaya Mandir", startDate: "2026-11-14", banner: "event2", isFree: true, price: 0 },
];

export const SAMPLE_QUOTE = {
  text: "Where there is Radha, there is Krishna; where there is Krishna, there is Radha — the two are one soul in two forms.",
  author: "Traditional Vaishnav teaching",
};

export const SAMPLE_LIVE_STREAMS = [
  { _id: "1", templeName: "Shri Radha Rani Temple, Barsana", isLive: true, thumbnail: "live1" },
  { _id: "2", templeName: "Banke Bihari Temple, Vrindavan", isLive: true, thumbnail: "live2" },
  { _id: "3", templeName: "ISKCON Vrindavan Chandrodaya Mandir", isLive: false, thumbnail: "live3" },
];

export const SAMPLE_GALLERY = [
  { _id: "1", title: "Radhashtami Shringar", type: "photo", thumbnail: "gallery1" },
  { _id: "2", title: "Nidhivan at Dusk", type: "photo", thumbnail: "gallery2" },
  { _id: "3", title: "Holi Celebrations, Barsana", type: "photo", thumbnail: "gallery3" },
  { _id: "4", title: "Yamuna Aarti", type: "photo", thumbnail: "gallery4" },
  { _id: "5", title: "Katha Pandal, Vrindavan", type: "photo", thumbnail: "gallery5" },
  { _id: "6", title: "Morning Mangala Aarti", type: "photo", thumbnail: "gallery6" },
];

export const SAMPLE_TESTIMONIALS = [
  { name: "Radhika Sharma", location: "Delhi", text: "Kishori Bhakti has become part of my morning routine — the daily quote and bhajans set the tone for my whole day." },
  { name: "Mohan Das", location: "Mathura", text: "The Live Darshan feature lets my mother, who can't travel anymore, feel connected to Barsana every single day." },
  { name: "Priya Vaishnav", location: "Mumbai", text: "I registered for the Vrindavan Katha Sammelan through the site — the whole process, ticket included, took two minutes." },
];
