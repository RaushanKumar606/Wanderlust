const express = require("express");
const route = express.Router({mergeParams:true});
const  wrapAsync  = require("../utils/wrapAsync.js");
const  ExpressError  = require("../utils/ExpressError.js");

const {validationReviews , isLogin,isReviewAuthor} =require("../meddleware.js")

const reviewsController = require("../controllers/reviews.controller.js")
// show reviews
route.get('/listings/:id', wrapAsync(reviewsController.reviewsShow));
//  post reviwe add route
route.post('/',validationReviews,isLogin,  wrapAsync(reviewsController.createReview ));
// deleting router 
route.delete("/:reviewid",isLogin,isReviewAuthor, wrapAsync(reviewsController.deleteReviews));

module.exports = route;
