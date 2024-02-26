const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

main().catch((err) => {
  console.log("Database connection error!");
  console.log(err);
});

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
  console.log("Database connected");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const sample = (array) => array[Math.floor(Math.random() * array.length)]; // to get a random element from an array

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "65be8842db75d662362bbcf8", //YOUR USER ID
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. In sunt eius itaque, repellendus quod facere eum cupiditate iure, aliquam optio atque laborum, ipsam sapiente voluptas! Illum sit eum totam veniam",
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dkvuykkng/image/upload/v1707781504/YelpCamp/zrgikwgxdpez10wcf9mx.jpg",
          filename: "YelpCamp/zrgikwgxdpez10wcf9mx",
        },
        {
          url: "https://res.cloudinary.com/dkvuykkng/image/upload/v1707781504/YelpCamp/pvar4knxeozzumeuqk03.jpg",
          filename: "YelpCamp/pvar4knxeozzumeuqk03",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
