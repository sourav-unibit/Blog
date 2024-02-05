const mongoose=require("mongoose");
const blog=new mongoose.Schema({
    title:{
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true,
    },
    type:{
        type:String,
        require:true,
    },
    image:{
        type:String,
        require:true,
    },
    category:{
        type:Object,
        default:{type:"blog",action:1}
        //blog 1, job_blog 2
    },
    status:{
        type:Object,
        default:{type:"active",action:1}
        //active 1 ,drafts 2,delete -1
    },
    bigText:{
        type:String,
    },
    favourite:{
        type:Array, //[{user_id,user_name,user_name}]
    },
    timestamp: { type: Number, default: Date.now },
    

   
})
const Blog=mongoose.model("Blog",blog);
module.exports=Blog;