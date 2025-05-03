const express = require("express");
const router =  express.Router(); // Created a router object.
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js"); // MVC
const multer = require("multer"); // to parse form's data we are using multer
const { storage } = require("../cloudConfig.js"); // multer was uploading our file in a folder but now we will upload it on cloudinary.
const upload = multer(({ storage })); // Multer will extract files from form's data and it will upload it in a folder named uploads which is created automatically. We are storing it in a folder for now but later we will put it on cloud.

// Router.route a way to group together routes with different verbs but same path.
router
  .route("/")
  .get(wrapAsync(listingController.index)) // Index Route
  .post(
    isLoggedIn,  
    upload.single("listing[image]"), // Jaise he post req aye "/" pr waise he multer jo listingImage se single image aa rhe hai vo cloud pr wanderlust naam k folder m upload kr de.
    validateListing,
    wrapAsync(listingController.createListing) // Create route
  );
  
// Search route
router.get("/search", wrapAsync(listingController.searchedListings));

// for icons: filter by category route
router.get("/category/:category", wrapAsync(listingController.filteredListings)); // Taking category filed out ie if req is sent to listings/category/Trending then Trending will be saved in category variable.

// Create: New Route Must be written before as it might be interpreted as listings/:id
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) // Read: Show route
  .put(
    isLoggedIn, 
    isOwner, 
    upload.single("listing[image]"), // Multer will parse our image then it will be stored in cloud inside folder named wanderlust.
    validateListing,
    wrapAsync(listingController.updateListing)
  ) // Update route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)); // Delete route

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
