const mongoose=require("mongoose");
const user=new mongoose.Schema({
    email:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
    phoneNumber:{
        type:Number,
        require:true
    },
    email:{
        type:String,
        require:true,
    },
    favourite:{
        type:Array,
        // [{blog_id,blog_name,blog_description,blog_image}]
    }
})
const User=mongoose.model("User",user);
module.exports= User