import mongoose from "mongoose";

const LOCAL_URI = "mongodb://localhost:27017/real_estate";

const tryConnect = async (uri, label) => {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`✅ Connected to MongoDB (${label})`);
    return true;
  } catch (err) {
    console.warn(`⚠️  Could not connect to ${label}: ${err.message}`);
    // Clean up failed connection attempt before retry
    try {
      await mongoose.disconnect();
    } catch {}
    return false;
  }
};

export const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;

  // Try the configured URI first (e.g., Atlas from .env)
  if (primaryUri) {
    const connected = await tryConnect(primaryUri, "Primary URI");
    if (connected) return;
  }

  // Fallback to local MongoDB
  console.log("↻ Falling back to local MongoDB...");
  const localConnected = await tryConnect(LOCAL_URI, "Local");
  if (localConnected) return;

  // If everything fails, throw a clear error
  throw new Error(
    "Failed to connect to MongoDB. Make sure mongod is running (systemctl start mongod)"
  );
};

export default connectDB;