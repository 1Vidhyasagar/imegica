const express = require('express')
const cors = require('cors')
const multer = require('multer')
const ejs=require('ejs')

require("./conn/db")

const app = express()

const port=9000;

const formRoutes= require('./routes/form')


//middleware
app.use(cors());
app.get("/", (req,res)=>{
    res.setHeader("access-control-allow-credentials","true");
    res.send("API is running...");
});


app.use(formRoutes)

app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})
