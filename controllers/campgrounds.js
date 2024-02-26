const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken }); // this contains the two methods in geocoding: forward geocoding and reverse geocoding. we need forward geocoding

const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createNewCampground = async (req, res) => {
  // if (!req.body.campground)
  // throw new ExpressError("Invalid Campground Data", 400);
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry; // this gives the array [longitude, latitude] for the location in GeoJSON format
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  })); //mapping the urls and filenames of the files that are uploaded when creating new campground. we obtained the information from req.files through multer
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully created a new Campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  //console.log(campground);
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  //console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  if (req.files.length > 0) {
    const imgs = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    campground.images.push(...imgs);
  }
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    //console.log(campground);
  }
  req.flash("success", "Successfully updated campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  for (let image of campground.images) {
    cloudinary.uploader.destroy(image.filename);
  }
  req.flash("success", "Successfully deleted campground");
  res.redirect("/campgrounds");
};
