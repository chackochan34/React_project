const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const ADMIN_EMAIL = "admin@auction.in";
const ADMIN_PASSWORD = "Admin@123";
const ADMIN_NAME = "Platform Admin";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    let admin = await User.findOne({ email: ADMIN_EMAIL }).select("+password");

    if (!admin) {
      admin = await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
      });
      console.log("Admin user created.");
    } else {
      admin.name = ADMIN_NAME;
      admin.password = ADMIN_PASSWORD;
      admin.role = "admin";
      await admin.save();
      console.log("Admin user updated (password reset and role ensured).");
    }

    console.log(`Login Email: ${ADMIN_EMAIL}`);
    console.log(`Login Password: ${ADMIN_PASSWORD}`);

    await mongoose.connection.close();
    console.log("Done.");
  } catch (error) {
    console.error("seed:admin failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
