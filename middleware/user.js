
const jwt=require("jsonwebtoken");
const User = require("../model/user");
const USER_JWT_SECRET=process.env.USER_JWT_SECRET
const isvalidUser=async(req,res,next)=>{
    try{
        let token=req.headers.authorization;
        if(!token){
            return res.status(401).json({message:"Unauthorized access"})
        }
        token=token.split(" ")[1];
        jwt.verify(token,process.env.USER_JWT_SECRET,async (error,decode)=>{
          // console.log("decode data--->" ,{error,decode}) if candidate token and user token also docode make sure user token anly pass
          if(error){
            return res.status(401).json({message:"Unauthorized access"})
          }
         
          const user= await User.findById(decode.data._id);
          if(!user){
            return res.status(401).json({message:"Unauthorized access"})
          }
          req.user=decode.data;
          next();
        })
    }catch(error){
        console.log("error from isvaliduser in middleware --> ", error);
        return res
        .status(500)
        .json({ message: "something worng try aganin later" });
    }
}
module.exports=isvalidUser;