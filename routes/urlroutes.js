const express=require('express')
const client= require("../controllers/redis/redis-client");
const router=express.Router();
const base64url = require('base64url'); 
const Url = require('../models/url');  



function generateShortUrl(counter) {

    console.log("inside genre")
    let shortUrl = base64url.encode(counter.toString());  // Convert the counter to a base64 string

    // If the generated URL is shorter than 7 characters, pad it with '0' (or any other character)
    if (shortUrl.length < 7) {
        shortUrl = shortUrl.padEnd(7, '0');
    } else if (shortUrl.length > 7) {
        shortUrl = shortUrl.substring(0, 7);  // Truncate to 7 characters if it's too long
    }
     console.log(shortUrl);
    return shortUrl;
}
router.post("/shorten",async(req,res)=>{
    const org= req.body.url;
    if (!org) {
        return res.status(400).json({ error: "Original URL is required" });
    }
   

    try {
   
        const counter=await client.get("url_counter");
        
        
        const shortUrl = generateShortUrl(counter);

       
        await client.incr('url_counter');
        

        const urlinfo = await Url.create({
            original: org,     // Correct field names according to your schema
            shortid: shortUrl  // Correct field names according to your schema
        });
        console.log('URL shortened and saved to database');

        res.status(201).json({ shortUrl });
    } catch (error) {
        res.status(500).json({ error: "Failed to shorten URL" });
    }

   
})

router.get('/:shortened_id', async (req, res) => {
    const shortid = req.params.shortened_id;
    console.log(`Short ID received: ${shortid}`);

    try {
        // Find the document with the matching shortid
        const details = await Url.findOne({ shortid: shortid });
        console.log(`Query result:${details}`);

        // If no document is found, return a 404 error
        if (!details) {
            return res.status(404).json({ message: "URL not found" });
        }

        // Redirect to the original URL
        return res.redirect(details.original);
    } catch (error) {
        // Handle any potential errors
        console.error("Error fetching URL:", error);
        return res.status(500).json({ message: "An error occurred", error });
    }
});

module.exports=router;

