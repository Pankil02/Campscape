const mongoose = require("mongoose");
const cities = require("./cities");
const Campground = require("../models/Campground");
const { places, descriptors } = require("./seedHElpers");

const db = mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

db.then(() => {
  console.log("Database, connection open. ");
}).catch((e) => {
  console.log(e);
  console.log("Error in Database Connection");
});
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city} , ${cities[random1000].state}`,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
