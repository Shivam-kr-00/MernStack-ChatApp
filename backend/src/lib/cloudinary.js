import { v2 as cloudinary } from "cloudinary"


import { config } from "dotenv";//dotenv is used to load environment variables from a .env file into process.env.

config();//Executes the dotenv config() function to read the .env file and make the variables available in process.env.

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;