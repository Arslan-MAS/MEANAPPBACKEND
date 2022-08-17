const express = require ('express');
const app = express();
const mongoose =require("mongoose");
const bodyParser = require("body-parser");
const postRoutes = require("./routes/posts")
const authRoutes = require("./routes/user")
const path = require("path");

mongoose.connect("mongodb+srv://MuhammadArslan:"+process.env.MONGO_ATLAS_PASS+"@clusterfirst.cad7o.mongodb.net/meanProject?retryWrites=true&w=majority").then(()=>{

console.log("Connected to Db");
}).catch(()=>{
console.log("Connection to Db failed" );
});
// app.use((req,res,next)=>{
//     console.log("First Middle Ware ");
//     next();
// })
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use ("/images",express.static(path.join("backend/images")));
app.use( (req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    
    res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,authorization");
    
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,DELETE,PUT,OPTIONS");
    next();
})
app.use("/api/posts",postRoutes);
app.use("/api/user",authRoutes);

module.exports= app; 