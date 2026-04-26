const mongoose = require("mongoose");

module.exports = async function connectDb() {
  const uri = (process.env.MONGO_URI || "").trim().replace(/^["']|["']$/g, "");
  if (!uri) {
    throw new Error("MONGO_URI is required");
  }

  if (uri.includes("%40cluster0") && !uri.includes("@cluster0")) {
    throw new Error(
      "MONGO_URI is missing the host separator. If your password is admin123, use admin:admin123@cluster0..., not admin:admin123%40cluster0..."
    );
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    // Atlas SRV records can resolve to IPv6 on some Windows networks. Forcing IPv4
    // avoids false "ReplicaSetNoPrimary" failures when IPv6 routing is flaky.
    family: 4,
    serverSelectionTimeoutMS: 15000
  });
  console.log("MongoDB connected");
};
