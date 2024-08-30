const Listing = require("./models/index.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const {reviewsSchema} = require("./schema.js");
const Review = require("./models/reviews.js");


module.exports.isLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; 
        req.flash("error", "You must be logged in to create listings");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirect = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner || !listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the of this  Owner Listing")
        res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validationListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errorMessage);
    }
    next();
  };

  module.exports.validationReviews = (req, res, next) => {
    let {error}=  reviewsSchema.validate(req.body);
    if(error){
        const errorMessage = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errorMessage)
      }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewid } = req.params;
    const review = await Review.findById(reviewid);
    if (!review.author || !review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You do not have permission to delete this review.");
        return res.redirect(`/listings/${id}`);
    }

    next();
}