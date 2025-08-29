const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.path, "..", req.originalUrl); // in our app, after user logges in we are redirecting him to /listings instead we must redirect him to where or what he want ie add new listing or edit.
  // console.log(req.user); // whenever the user logs in it's related information is stored in request object. next part in middleware.js file.
  if(!req.isAuthenticated()) { // isAuthenticated: is a passport method which checks whether the user is logged in or not. If not it returns false.  And that user related info triggers isAuthenticated method
    // redirectUrl save (We need to save it when user is not logged in, if he is logged in then there is no need for it).
    req.session.redirectUrl = req.originalUrl; // passport deletes all these info after login so to handel that we need to save it in locals as those values we can use anywhere and passport cant delete it.
    req.flash("error", "You must be logged in before making changes!");
    return res.redirect("/login");
  }
  next(); // if user is authenticated.
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl) { // after login passport deletes all the info so to keep this imp information we are storing it in locals which cant be deleted by passport and can be used anywhere.
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  
  if(!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports.validateListing = (req, res, next) => { // to validate server side listing using joi
  let { error } = listingSchema.validate(req.body); // Jo humne listingSchema create kra hai using Joi uske andr hum check kr rhe hai ki jo bhi req ki body m hai vo valid hai ya nhi.
  if(error) {
    let errMsg = error.details.map((el) => el.message).join(","); // join all the error details or multiple details with ,
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => { // to validate server side review using joi
  let { error } = reviewSchema.validate(req.body); // Jo humne listingSchema create kra hai using Joi uske andr hum check kr rhe hai ki jo bhi req ki body m hai vo valid hai ya nhi.
  if(error) {
    let errMsg = error.details.map((el) => el.message).join(","); // join all the error details or multiple details with ,
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
