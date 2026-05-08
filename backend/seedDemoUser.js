import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";

dotenv.config();

const demoUser = {
  username: "Demo User",
  email: "demo@example.com",
  password: "password123",
  avatar: ""
};

try {
  await mongoose.connect(process.env.MONGO_URI);

  const existingUser = await User.findOne({ email: demoUser.email });
  if (existingUser) {
    existingUser.username = demoUser.username;
    existingUser.password = demoUser.password;
    existingUser.avatar = demoUser.avatar;
    existingUser.online = false;
    await existingUser.save();
    console.log("Demo user password reset.");
  } else {
    await User.create(demoUser);
    console.log("Demo user created.");
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
