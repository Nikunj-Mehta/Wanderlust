const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// Creates a new review for a listing: finds the listing by ID, creates a review using form data, sets the author, pushes the review to the listing's reviews array, saves the review first, then saves the listing, and finally redirects to the listing's show page.
module.exports.createReview = async (req, res) => {
  // let { id } = req.params; // we take id form param
  // let{ rating, comment } = req.body.review; // and form content form body
  // console.log(id);
  // console.log(rating);
  // console.log(comment);

  console.log(req.params.id); // No id parameter is received in here. But when we use const router = express.Router({ mergeParams: true });, we can access the id from the parent route.

  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview);
  listing.reviews.push(newReview); // uss listing ki review array m add kr do review jo aya tha as an object.

  await newReview.save(); // First save review
  await listing.save(); // then save that added review in listing.

  // console.log("new review saved");
  req.flash("success", "New Review Created!");

  res.redirect(`/listings/${listing._id}`)
};

// Finds the listing by ID and the review by reviewId, removes the review from the listing's reviews array, deletes the review from the reviews collection, and then redirects to the listing's show page.
module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}) // $pull is a mongoose operator which removes the review which match the id form reviews array.
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};