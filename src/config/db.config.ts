import mongoose from "mongoose";

export const connectDB = () => {
  try {
    const DB = process.env.MONGODB_CNN || "";
    return new Promise<void>((resolve, _) => {
      mongoose
        .connect(DB)
        .then(() => {
          console.log(
            `Connected to MongoDb in ${process.env.NODE_ENV} environment...`,
          );
          resolve();
        })
        .catch((err: any) => {
          throw new Error(`Error initializing databse ${err}`);
        });
    });
  } catch (error) {
    throw new Error("Failed connection to the DB");
  }
};

export const disconnectDB = () => mongoose.disconnect();