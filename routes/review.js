const express = require("express");
const router =  express.Router({mergeParams: true}); // Created a router object. to get parent params.
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

// MVC
const reviewController = require("../controllers/reviews.js");


// Post Review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Reviews: Delete route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;