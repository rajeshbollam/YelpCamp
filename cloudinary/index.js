const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "YelpCamp",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
  invalidate: true, //used this to delete images from cloudinary instantly rather than defaulting to store deleted images for 30 days
}); //this storage is setup in cloudinary where we created a folder with title yelpcamp and desired formats for images

module.exports = { cloudinary, storage };
