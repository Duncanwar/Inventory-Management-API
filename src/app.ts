import express from "express";
import indexRoute from "./v1/routes/index";
import { connectDatabase, disconnectDatabase } from "./v1/config/database";

const app = express();

// import "./v1/config/database.js";

const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use("/api/v1", indexRoute);
app.get("*", (req, res) => {
  res.status(200).json("Hello World");
});

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};
console.log(`Server is running on port ${PORT}`);
startServer().catch(console.error);

process.on("SIGINT", async () => {
  try {
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error("Failed to disconnect from database :", error);
    process.exit(1);
  }
});