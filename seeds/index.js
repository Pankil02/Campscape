const mongoose = require("mongoose");
const cities = require("./cities");
const Campground = require("../models/Campground");
const { places, descriptors } = require("./seedHelpers");

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
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      price,
      location: `${cities[random1000].city} , ${cities[random1000].state}`,
      image:
        "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia iure animi ullam odio eius? Esse rem porro provident doloribus cum laudantium consequatur numquam recusandae, corporis modi quam, corrupti natus suscipit.",
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
