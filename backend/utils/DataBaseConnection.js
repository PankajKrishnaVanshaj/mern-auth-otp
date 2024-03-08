import mongoose from "mongoose";

export const DBConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL).then(() => {
      console.log("DataBase connect successfully");
    });
  } catch (error) {
    console.log("DataBase connection failed");
  }
};
