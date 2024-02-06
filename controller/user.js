const Blog = require("../model/blog")
const { mongoose } = require("mongoose");
const { numberSchema } = require("../validation/PhoneNumberValidation");
const { userSignUpSchema, userSignInSchema } = require("../validation/userValidation");
const bcrypt = require('bcrypt');
const User = require("../model/user");
const USER_JWT_SECRET=process.env.USER_JWT_SECRET;
const jwt=require("jsonwebtoken");
const saltRounds = 10;
const CryptoJS=require('crypto-js')
const ENCRYPTED_SECRET_KEY=process.env.ENCRYPTED_SECRET_KEY
const handleShowBlog=async(req,res)=>{
    try{
        let {index,category,limit}=req.query;
        if(!limit){
            limit=10;
        }
        if(!index){
            index=0;
        }
        const skip = index * limit;
        console.log({category})
        const data=await Blog.find({'status.action':{$ne:-1},'category.action': category?Number(category):1}).skip(skip).limit(limit).select("title description image");
        console.log("book data length",data.length)
        // when data is empty
        if(!data.length){
            return res.status(200).json({message:"nothing bolg are present"})
           }
        const encryptText= CryptoJS.AES.encrypt(JSON.stringify(data),ENCRYPTED_SECRET_KEY).toString()
        // console.log(encryptText)
      
        
        res.status(200).json({data:encryptText})
    }catch(error){
     console.log("error form handleShowBlog ->",error)
     res.status(500).json("somthing wrong....")
    }
   
}
const handleShowDetails=async(req,res)=>{
    try{
        const _id=req.params._id;
        if(!mongoose.Types.ObjectId.isValid(_id)){
            return res.status(200).json({message:"id is not valid "})
        }
        const blog=await Blog.findOne({ _id, 'status.action': { $ne: -1 } });
        if(!blog){
            return res.status(404).json({message:"blog is not found"})
        }
        return res.json({blog})
    }catch(error){
        console.log("error form handleShowDetails ->",error)
      return  res.status(500).json("somthing wrong....")
       }
}
const handleShowLatestBlog=async(req,res)=>{
    try{
        const data=await Blog.find({'status.action':{$ne:-1}}).limit(5).sort({timestamp:-1});
        res.status(200).json({data})
    }catch(error){
        console.log("error form handleShowLatestBlog ->",error)
      return  res.status(500).json("somthing wrong....")
       }
}
const handlePhoneNumberValid=async(req,res)=>{
    try{
        const result = numberSchema.validate(req.body);
        if(result.error){
            res.status(500).json( {
                status: "error",
                message: result.error.message,
                responseCode: 500,
                data: null,
              });
              return;
        }
        const {number}=req.body;
        res.status(200).json({message:"number is valid "})
    }catch(error){
        res.status(500).json({message:"something wrong..."})
    }
}
const handleSignUp=async(req,res)=>{
    try{
        const result=userSignUpSchema.validate(req.body)
        if(result.error){
            res.status(500).json( {
                status: "error",
                message: result.error.message,
                responseCode: 500,
                data: null,
              });
              return;
            }
            const {name,email,password,phoneNumber}=req.body;
            const isUserExit=await User.findOne({email});
            if(isUserExit){
                return  res.status(200).json({message:"user already exsit"})
            }
            bcrypt.genSalt(saltRounds, async function(err, salt) {
                bcrypt.hash(password, salt, async function(err, hash) {
                    console.log(hash)
                    const data=await User.create({email,password:hash,phoneNumber,name})
                    return res.status(201).json({message:"user signup successfuly"})
                });
            });
    }catch(error){
        console.log("error from handleSignUp",error);
        return res.status(500).json({message:"somthing wrong...."});

    }
}
const handleSignIn=async(req,res)=>{
    try{
        const result = userSignInSchema.validate(req.body);
        if(result.error){
            res.status(500).json( {
                status: "error",
                message: result.error.message,
                responseCode: 500,
                data: null,
              });
              return;
        }
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(200).json({message:"fill all data"})
        }
        
        const data=await User.findOne({email})
        if(!data){
            return res.status(200).json({message:"user is not exist"})
        }
        bcrypt.compare(password, data.password, function(err, result) {
            if(err){
                return res.status(500).json({message:"something worng..."})
            }
            if(result){
                jwt.sign({data},USER_JWT_SECRET,(error,token)=>{
                    if(error){
                        return res.status(500).json({message:"something worng..."})
                    }
                    return res.status(200).json({token});
                })
            }else{
                return res.status(200).json({message:"password is not match"})
            }
        });
    }catch(error){
        console.log("error from handleSignIn",error)
        res.status(500).json({message:"something worng..."})
    }
}
//this api not ready it's only understaning of transition of mongoose 
const handleAddFavouriteBlog=async(req,res)=>{
    try{
        const _id=req.params._id;
        if(!mongoose.Types.ObjectId.isValid(_id)){
            return res.status(200).json({message:"id is not valid "})
        }
        const blog=await Blog.findById(_id).select("title description image  ");
        if(!blog){
            return res.status(404).json({message:"blog is not found"})
        }
          // [{blog_id,blog_title,blog_description,blog_image}]
        // const {email,name}=req.user
        
        // const{title:blog_title,description:blog_description,image:blog_image,_id:blog_id}=blog
        // const isAllreadyAddInFavourite=await User.findOne({email,"favourite"})
        // console.log({blog_id,blog_title,blog_description,blog_image})
        // const inUser=await User.updateOne({email},{$push:{favourite:{blog_id,blog_title,blog_description,blog_image}}})
        // console.log(inUser)
        return res.status(200).json({message:"suceess"})
    }catch(error){
     console.log("error form handleAddBlog ->",error)
     res.status(500).json("somthing wrong....")
    }
}
const handleDecryptData = async (req, res) => {
    try {
      const { data } = req.body;
      
      if (!data) {
        return res.status(400).json({ message: "Please enter data" });
      }
      const bytes = CryptoJS.AES.decrypt(data, ENCRYPTED_SECRET_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      let decryptdata;
     try{
    decryptdata=JSON.parse(decryptedString)
     }catch(error){
       return  res.status(500).json({message:"invalid encrypted data"});
     }
      res.status(200).json({ data: decryptdata });
    } catch (error) {
      console.error("Error from handleDecryptData ->", error);
      res.status(500).json({message:"Something went wrong...."});
    }
  };
const handleSearch=async(req,res)=>{
    try{
        let {value}=req.params;
    const regexChracter=new RegExp(value,'i')
    value=value.split(" ")
    console.log(value);
    // const regexword=value.map(word=>new RegExp(word,'i'))
     const data=await  Blog.find({title:{$regex:regexChracter}})
    //  const data=await  Blog.find({title: { $eq: regexword }})
        res.status(200).json({data})
    
    }catch(error){
     console.log("error form handleAddBlog ->",error)
     res.status(500).json("somthing wrong....")
    }
}
  
const handleTranstion=async(req,res)=>{
    const session=await mongoose.startSession();
    session.startTransaction();
    try{
        const {blog_id,user_id}=req.body;
        // console.log({blog_id,user_id})
    const blog=await Blog.findByIdAndUpdate(blog_id,{$push:{favourite:{user_id}}},{session})
    const user=await User.findByIdAndUpdate(user_id,{$push:{favourite:{blog_id}}},{session})
    // if(!blog||!user){
    //     res.status(500).json({message:"failed to update data"})
    // }
    console.log({blog,user});
    await session.commitTransaction();
    res.status(200).json({message:"success"})
    }catch(error){
        await session.abortTransaction();
     console.log("error form handleTranstion ->",error)
     res.status(500).json("somthing wrong....")
    }finally{
        session.endSession();
    }
}

module.exports={handleShowBlog,handleShowDetails,handleShowLatestBlog,handlePhoneNumberValid,handleSignUp,handleSignIn,handleAddFavouriteBlog,handleDecryptData,handleSearch,handleTranstion}