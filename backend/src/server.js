require('dotenv').config();
const app = require("./app");
const connectDb = require("./config/db");

const port = process.env.PORT || 5000;

connectDb()
  .then(() => {
    const server = app.listen(port, () => {
      console.log(`MacroHostel API listening on port ${port}`);
    });
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use. Change PORT in backend/.env or stop the other backend terminal.`);
        process.exit(1);
      }
      throw error;
    });
  })
  .catch((error) => {
    const message = error.message || "";
    if (
      message.includes("Could not connect to any servers") ||
      message.includes("ReplicaSetNoPrimary") ||
      message.includes("Server selection timed out")
    ) {
      console.error("Failed to start API: MongoDB Atlas is not reachable from this machine/network.");
      console.error(
        "Run `npm run check:mongo` from the backend folder. If DNS works but connection fails, try a different network/hotspot or use a local MongoDB URI."
      );
    } else {
      console.error("Failed to start API:", message);
    }
    process.exit(1);
  });
