const express = require("express");
const usernames = require("./src/database_handler/server");
const app = express();
app.use(express.json());
app.use(express.static(__dirname + "/src/certificate_handler"));
app.use(express.static(__dirname + "/images"));
app.use(express.static(__dirname + "/vendors"));
app.use(express.static(__dirname + "/pdfs"));

app.get("/", (req, res) => {
  res.status(200).sendFile("index.html", { root: __dirname });
});
app.post("/", async (req, res) => {
  const newName = await usernames.create(req.body);
});
app.listen(8080, () => {
  console.log("running");
});
