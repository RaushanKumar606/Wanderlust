const express = require("express");
const multer = require("multer");
const route = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/index.js");
const { isLogin, isOwner, validationListing } = require("../meddleware.js");
const { storage } = require("../cloudinary/cloudinary.js");

const upload = multer({ storage });
const listingControllers = require("../controllers/listing.controller.js");

route.get("/", wrapAsync(listingControllers.index));
route.get("/new", isLogin, wrapAsync(listingControllers.renderNewFrom));
//   show route
route.get(
  "/:id",

  wrapAsync(listingControllers.renderShow)
);
// create router for listing 
route.post(
  "/",
  isLogin,
  // isOwner,
  validationListing,
  // upload.single("listing[image]"),
  wrapAsync(listingControllers.listingCreate)
);

//edit router
route.get(
  "/:id/edit",
  isLogin,
  isOwner,
  wrapAsync(listingControllers.renderEdit)
);
// update
route.put(
  "/:id",
  isLogin,
  isOwner,
  upload.single("listing[image]"),
  validationListing,
  wrapAsync(listingControllers.renderUpdate)
);
// delete route
route.delete(
  "/:id",
  isLogin,
  isOwner,
  wrapAsync(listingControllers.renderDestroy)
);

module.exports = route;
