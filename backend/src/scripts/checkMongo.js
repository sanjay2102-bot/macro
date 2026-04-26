require("dotenv").config();

const dns = require("dns").promises;
const mongoose = require("mongoose");

function sanitizeUri(uri) {
  return uri.replace(/\/\/([^:]+):([^@]+)@/, (_match, user) => `//${user}:***@`);
}

async function main() {
  const uri = (process.env.MONGO_URI || "").trim().replace(/^["']|["']$/g, "");
  if (!uri) {
    throw new Error("MONGO_URI is missing in backend/.env");
  }

  console.log(`Using: ${sanitizeUri(uri)}`);

  const hostMatch = uri.match(/@([^/?]+)/);
  const host = hostMatch?.[1];
  if (host) {
    console.log(`Resolving SRV records for ${host}...`);
    const records = await dns.resolveSrv(`_mongodb._tcp.${host}`);
    console.log(`Found ${records.length} MongoDB hosts: ${records.map((record) => record.name).join(", ")}`);
  }

  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(uri, {
    family: 4,
    serverSelectionTimeoutMS: 20000
  });

  console.log("MongoDB connection OK");
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(`${error.name}: ${error.message}`);
  if (error.message.includes("querySrv") || error.code === "ENOTFOUND") {
    console.error("DNS could not resolve the Atlas SRV record. Try another network or DNS provider.");
  }
  if (error.message.includes("Could not connect to any servers")) {
    console.error("Atlas is reachable by DNS, but MongoDB traffic is blocked or the cluster is unavailable.");
  }
  process.exit(1);
});
