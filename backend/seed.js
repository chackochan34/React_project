const mongoose = require('mongoose');
require('dotenv').config();
const Plate = require('./models/Plate');

const states = ["KL 07 AB","KL 01 AA","TN 09 ZZ","MH 01 AB","DL 01 AA","KA 01 AB"];
const fancyNumbers = ["0001","0007","0009","0011","0077","0088","0099","1111","2222","3333","4444","5555","6666","7777","8888","9999","1234","2345","3456","4567","5678","1221","2112","3443","4554","5665","6776","7878","9090","6969","8080"];
const statuses = ["ongoing","upcoming","completed"];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Plate.deleteMany({});
    console.log('🗑️  Cleared existing plates');

    const plates = [];
    let id = 1;
    states.forEach(state => {
      fancyNumbers.forEach(num => {
        plates.push({
          number: `${state} ${num}`,
          type: (num === '0001' || num === '9999' || num === '7777') ? 'VIP' : 'Fancy',
          currentPrice: Math.floor(150000 + Math.random() * 400000),
          bidsCount: Math.floor(10 + Math.random() * 300),
          timeRemaining: Math.floor(Math.random() * 3600),
          status: statuses[Math.floor(Math.random() * statuses.length)],
          description: `Premium number plate ${state} ${num}`
        });
      });
    });

    const created = await Plate.insertMany(plates);
    console.log(`✅ Seeded ${created.length} plates`);
    await mongoose.connection.close();
    console.log('✅ Seeding complete');
  } catch (err) {
    console.error('❌ Seed error', err);
    process.exit(1);
  }
}

seed();
