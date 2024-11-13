require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;
const _dirname = path.resolve();

const MONGOURI = process.env.MONGOURI;

mongoose.set("strictQuery", false);
mongoose.connect(MONGOURI);
mongoose.connection.on("connected", () => {
  console.log("Mongodb connected successfully!");
});
mongoose.connection.on("error", (error) => {
  console.log("Mongodb error:", error);
});

require("./models/user");
require("./models/post");

const corsOptions = {
  origin: ["http://localhost:3000", "https://social-app-iota-livid.vercel.app"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));

const isProduction = process.env.NODE_ENV;
const staticDir = isProduction && path.join(_dirname, "../client/build"); // info: Adjust this path if needed
if (isProduction === "production") {
  app.use(express.static(staticDir));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(staticDir, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server is runnig on", `http://localhost:${PORT}`);
});

