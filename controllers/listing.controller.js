const Listing = require("../models/index.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("index.ejs", { allListings });
  };
// create form new listing
  module.exports.renderNewFrom = async (req, res) => {
    console.log(req.params)
    res.render("newForm.ejs");
  };

  module.exports.renderShow = async (req, res) =>
     {let { id } = req.params;
  const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  if (!listing) {
    req.flash("error", "Listing your are dose not Exits");
    res.redirect("/listings");
  }
  if (listing) {
    res.render("show", { listing });
  } else {
    res.status(404).send("Listing not found");
  }
  console.log(listing);
  }
// create router
  module.exports.listingCreate =async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
       // Make sure req.body.listing exists
       if (!req.body.listing) {
        req.flash("error", "'listing' is required");
        return res.redirect("/listings/new");
    }
    console.log(req.body);
    let newListing = new Listing(req.body.listing);
    console.log(newListing);
    newListing.owner= req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
    console.log(newListing);
  }

  // get edit router
  module.exports.renderEdit= async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    req.flash("success", "Listing Edited!");
    let orignalImage = listing.image.url;
    orignalImage =orignalImage.replace("/upload","/upload/h_50,w_50")
    res.render("edit.ejs", { listing , orignalImage});
  }

  // update
  module.exports.renderUpdate = async (req, res) => {
    let { id } = req.params;
     let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  
     if(typeof req.file !=="undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      
     }
     listing.save();
    req.flash("success", "New Listing Updated!");
    res.redirect(`/listings/${id}`);
  }

  //delete
  module.exports.renderDestroy =async (req, res) => {
    let { id } = req.params;
    let delet = await Listing.findByIdAndDelete(id);
    console.log(delet);
    req.flash("success", " successful Delete Listing ");
    res.redirect("/listings");
  }