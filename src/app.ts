import express from "express";
const app = express();

// import "./v1/config/database.js";

const port = process.env.PORT || 8000;

app.get("*", (req, res) => {
  res.status(200).json("Hello World");
});

app.listen(port, () => {
  console.log(`Server listening on port:${port}`);
});
