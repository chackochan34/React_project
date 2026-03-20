const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Auction = require("./models/Auction");

dotenv.config();

// Indian state/UT registration codes (plus BH series)
const stateCodes = [
  "AP",
  "AR",
  "AS",
  "BR",
  "CG",
  "CH",
  "DD",
  "DL",
  "GA",
  "GJ",
  "HR",
  "HP",
  "JK",
  "JH",
  "KA",
  "KL",
  "LA",
  "LD",
  "MH",
  "ML",
  "MN",
  "MP",
  "MZ",
  "NL",
  "OD",
  "PB",
  "PY",
  "RJ",
  "SK",
  "TN",
  "TR",
  "TS",
  "UK",
  "UP",
  "WB",
  "BH",
];

const batchSize = 2000;
const rtoCode = "01";
const series = "AA";

const getType = (num) => {
  if (num === "0001" || num === "9999") return "VIP";
  if (/^(\d)\1{3}$/.test(num)) return "VIP";
  if (/^(\d)\1{2}\d$/.test(num) || /^(\d)\1\d\1$/.test(num) || /^\d(\d)\1{2}$/.test(num)) return "Trending";
  return "Fancy";
};

const getPrice = (type, n) => {
  if (type === "VIP") return 1200000 + (n % 50) * 25000;
  if (type === "Trending") return 450000 + (n % 70) * 7000;
  return 120000 + (n % 90) * 3500;
};

const getStatus = (n) => {
  if (n % 9 === 0) return "completed";
  if (n % 4 === 0) return "upcoming";
  return "ongoing";
};

const getEndTime = (status, n) => {
  const now = Date.now();
  if (status === "completed") return new Date(now - ((n % 48) + 1) * 60 * 60 * 1000);
  if (status === "upcoming") return new Date(now + ((n % 96) + 24) * 60 * 60 * 1000);
  return new Date(now + ((n % 24) + 1) * 60 * 60 * 1000);
};

const buildDoc = (state, n) => {
  const num = String(n).padStart(4, "0");
  const type = getType(num);
  const status = getStatus(n);
  const featured = type === "VIP" || n % 111 === 0;
  const number = `${state} ${rtoCode} ${series} ${num}`;

  return {
    number,
    type,
    price: getPrice(type, n),
    status,
    endTime: getEndTime(status, n),
    featured,
    description: `Premium ${type} Indian number plate ${number}.`,
    bids: [],
    topBidder: null,
  };
};

const seedStateNumbers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    console.log("Clearing existing auctions...");
    await Auction.deleteMany({});

    let total = 0;
    for (const state of stateCodes) {
      console.log(`Seeding ${state} (${rtoCode} ${series})...`);
      let docs = [];

      for (let n = 1; n <= 9999; n += 1) {
        docs.push(buildDoc(state, n));

        if (docs.length >= batchSize) {
          const inserted = await Auction.insertMany(docs, { ordered: false });
          total += inserted.length;
          docs = [];
        }
      }

      if (docs.length) {
        const inserted = await Auction.insertMany(docs, { ordered: false });
        total += inserted.length;
      }

      console.log(`Completed ${state}. Running total: ${total}`);
    }

    console.log(`Seed completed. Total auctions inserted: ${total}`);
    await mongoose.connection.close();
    console.log("Done.");
  } catch (error) {
    console.error("seed:states failed:", error.message);
    process.exit(1);
  }
};

seedStateNumbers();
