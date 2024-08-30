const mongoose = require("mongoose");
const initData =  require("./sample.data.js")
const Listing = require("../models/index.js")

const MONGO_URL ='mongodb://127.0.0.1:27017/TestDb';
async function main() {
    try {
        await mongoose.connect(MONGO_URL );    
        console.log('Connection successful to DataBase thank you mongodb');        } catch (err) {
        console.error('Connection error:', err);
    }}
main();

const intiDB = async () => {
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: new mongoose.Types.ObjectId("66cc55b26839cf53ca76cd21") // Ensure correct ObjectId format
    }));
    await Listing.insertMany(initData.data);

    console.log("data was initlization")
}
intiDB();