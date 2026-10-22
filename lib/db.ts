import mongoose from "mongoose";

const globalForMongoose = globalThis as unknown as {
  mongoose?: Promise<typeof mongoose>;
};

export function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  globalForMongoose.mongoose ??= mongoose
    .connect(uri, { dbName: process.env.MONGODB_DB || "taskmanager" })
    .catch((err) => {
      globalForMongoose.mongoose = undefined;
      throw err;
    });

  return globalForMongoose.mongoose;
}
