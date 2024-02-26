const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../cloudinary"); //we didn't put /index as node automatically looks for index.js in a folder
const upload = multer({ storage });
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createNewCampground)
  ); // we put upload.array middleware infront of the validatecampground middleware because to validate a campround, it checks if the req.body is fully parsed. if we put validateCampground middleware before, as the req.body is not fully parsed yet and will be parsed by multer through upload.array, we encounter errors.

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
