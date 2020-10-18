const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config files/config.env" });
const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("Connected");
  });

const nameSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});
const usernames = mongoose.model("usernames", nameSchema);
module.exports = usernames;
