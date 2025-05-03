const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// We need to pass the configuration details. Configuration - cheezo ko jodna, humere backend ko cloudinary k account k saath jodne k liya .env file wali information chaiyea hogi.
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // names to the left are ment to write as it is and we can't change them.
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Define storage cloudinary k account pr is naam k folder m data rhega.
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wandelust_DEV',
    allowedFormats: ["png", "jpg", "jpeg"]
  },
});

module.exports = {
  cloudinary,
  storage,
}