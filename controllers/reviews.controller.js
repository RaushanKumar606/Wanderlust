const Listing = require("../models/index.js");
const Review = require("../models/reviews.js");


module.exports.reviewsShow =async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate('reviews');
    if (!listing) {
        return res.status(400).send("Listing not 12 found");
    }
    res.render("show", { listing }); // or res.json(listing); depending on your needs
}

//  post reviwe add route
module.exports.createReview = async(req, res) => {
    console.log(req.params.id)
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(400).send("Listing Not Found something Error !");
        }
        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        await newReview.save();
        listing.reviews.push(newReview);
        await listing.save();
        req.flash("success","New review Created")
        console.log("New review saved");
        res.redirect(`/listings/${listing._id}`); 
        // res.status(500).send("Internal server error");  
}
// deleting router 
module.exports.deleteReviews = async (req, res, next) => {
    const { id, reviewid } = req.params;
    const listing = await Listing.findById(id);
    const review = await Review.findById(reviewid);
    if (!listing || !review) {
        throw new ExpressError(404, "Review or Listing not found!");
    }
    //await review.remove();
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","Delete  Reviews")
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    res.redirect(`/listings/${id}`);
}