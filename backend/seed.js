const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Auction = require("./models/Auction");

dotenv.config();

const sampleAuctions = [
  { number: "MH 01 AB 0001", type: "VIP", price: 1800000, status: "ongoing", featured: true },
  { number: "DL 01 CE 0007", type: "Fancy", price: 850000, status: "ongoing", featured: true },
  { number: "KA 03 MK 0099", type: "Trending", price: 1200000, status: "ongoing", featured: true },
  { number: "GJ 01 KT 0101", type: "Fancy", price: 600000, status: "upcoming", featured: false },
  { number: "TN 10 PR 0777", type: "VIP", price: 1450000, status: "ongoing", featured: true },
  { number: "RJ 14 AA 1111", type: "VIP", price: 2500000, status: "ongoing", featured: true },
  { number: "UP 32 BM 1234", type: "Trending", price: 700000, status: "upcoming", featured: false },
  { number: "TS 09 CR 2222", type: "Fancy", price: 1350000, status: "ongoing", featured: true },
  { number: "PB 10 DN 3333", type: "VIP", price: 2100000, status: "ongoing", featured: true },
  { number: "HR 26 EQ 4444", type: "Fancy", price: 980000, status: "completed", featured: false },
  { number: "CG 04 FD 4567", type: "Trending", price: 720000, status: "upcoming", featured: false },
  { number: "AP 39 GH 5555", type: "VIP", price: 2300000, status: "ongoing", featured: true },
  { number: "MP 09 JJ 6666", type: "Fancy", price: 1250000, status: "ongoing", featured: true },
  { number: "OD 05 KL 7007", type: "Trending", price: 760000, status: "ongoing", featured: false },
  { number: "KL 07 MN 7777", type: "VIP", price: 2650000, status: "ongoing", featured: true },
  { number: "AS 01 PQ 8008", type: "Fancy", price: 880000, status: "upcoming", featured: false },
  { number: "CH 01 RS 8888", type: "VIP", price: 2850000, status: "ongoing", featured: true },
  { number: "BR 01 TU 9009", type: "Trending", price: 930000, status: "completed", featured: false },
  { number: "WB 02 VX 9898", type: "Fancy", price: 1100000, status: "ongoing", featured: true },
  { number: "BH 12 ZY 9999", type: "VIP", price: 3200000, status: "ongoing", featured: true },
];

const addTiming = (auction, index) => {
  const now = Date.now();
  let endOffset = 0;
  if (auction.status === "ongoing") endOffset = (index + 1) * 60 * 60 * 1000;
  if (auction.status === "upcoming") endOffset = (index + 18) * 60 * 60 * 1000;
  if (auction.status === "completed") endOffset = -(index + 1) * 60 * 60 * 1000;

  return {
    ...auction,
    endTime: new Date(now + endOffset),
    description: `Premium ${auction.type} Indian number plate ${auction.number} available in live auction.`,
  };
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await Auction.deleteMany({});
    const docs = sampleAuctions.map(addTiming);
    await Auction.insertMany(docs);

    console.log(`Seed complete: ${docs.length} auctions inserted.`);
    await mongoose.connection.close();
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seed();
