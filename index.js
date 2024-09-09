const express=require('express')
const app=express();
const urlrouter=require("./routes/urlroutes");

require('dotenv').config();
const connectdb=require("./config/database")

connectdb();

app.use(express.json());
app.get("/",(req,res)=>{
    res.status(200).send("hello");
})

app.use('/',urlrouter)
const port=process.env.PORT;

app.listen(port,()=>{
    console.log(`server listening in port ${port}`)
})