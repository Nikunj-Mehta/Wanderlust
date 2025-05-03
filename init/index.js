const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
  console.log("Connected to DB");
}).catch((err) => {
  console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({}); // will delete all the prior data from db
  initData.data = initData.data.map((obj) => ( { ...obj, owner: "67fe07cb9c671dd591e64e60" })); // adding single owner for all lisings.
  await Listing.insertMany(initData.data); // will add all the sample data.
  console.log("data was initialized");
};

initDB();