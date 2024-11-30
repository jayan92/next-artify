import mongoose from "mongoose";

// Keep track of the database connection state
let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true); // Recommended for better query filtering.

  if (isConnected) {
    console.log("MongoDB is already connected.");
    return;
  }

  try {
    // Establish a new connection
    const connection = await mongoose.connect(process.env.MONGO_URL, {
      dbName: "artify",
      tls: true,
      tlsAllowInvalidCertificates: false,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30s
      socketTimeoutMS: 30000, // Increase socket timeout to 30s
    });
    // console.log("🚀 ~ connectToDB ~ connection:", connection);

    isConnected = connection.connections[0].readyState === 1; // Ensure the connection is active

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    if (error.message.includes("SSL")) {
      console.error(
        "Ensure your Node.js and OpenSSL versions support TLS 1.2 or higher."
      );
    }
  }
};

// Optional: Add listeners for connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to the database.");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected.");
});
