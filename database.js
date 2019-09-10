const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://alorayb:ah123456@cluster0-qektw.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
const db = mongoose.connection;

db.on("error", function() {
  console.log("mongoose connection error");
  console.log("____________________________");
});

db.once("open", function() {
  console.log("mongoose connected successfully");
  console.log("____________________________");
});

let moneySchema = new mongoose.Schema({
  name: String,
  password: String,
  income: Number,
  currency: String,
  hasAgreed: Boolean
});

let money = mongoose.model("money", moneySchema);

let getusers = async cb => {
  try {
    // console.log("1");
    let allUsers = await money.find({});
    // console.log("2");
    cb(allUsers);
    // console.log("3");
  } catch (error) {
    cb(error);
  }
};

let addUser = (user, cb) => {
  console.log(user);
  money.insertMany(user, function(error, docs) {});
  getusers(cb);
};

module.exports = {
  addUser,
  getusers
};
