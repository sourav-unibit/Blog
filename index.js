const express=require("express");
const mongoose=require("mongoose")
const { error } = require("console");
require("dotenv").config()
const app=express();
app.use(express.json())
// mongodb connection
mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("mongodb connecting successfully")
}).catch((error)=>{
    console.log("error from mongodb connecting",error)
})
//router
const userRouter=require("./routes/user")
const adminRoute = require("./routes/admin");
const PORT=process.env.PORT;
app.use('/admin',adminRoute)
app.use('/',userRouter)
app.get("/test",(req,res)=>{
    res.send("ok")
})
app.listen(PORT,(error)=>{
    if(error){
        console.log("server connection error-> ",error)
    }else{
        console.log("server running successfuly at->",PORT)
    }
})