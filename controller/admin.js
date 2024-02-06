const Admin = require("../model/admin");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;
const jwt = require("jsonwebtoken");
const Blog = require("../model/blog");
const { default: mongoose } = require("mongoose");
const { authSchema } = require("../validation/admin");
const { blogSchema } = require("../validation/BlogValidate");
const CryptoJS=require('crypto-js')
const ENCRYPTED_SECRET_KEY=process.env.ENCRYPTED_SECRET_KEY
const HandleAdminCreate = async (req, res) => {
  try {
    const result = authSchema.validate(req.body);
    if (result.error) {
      res.status(500).json({
        status: "error",
        message: result.error.message,
        responseCode: 500,
        data: null,
      });
      return;
    }
    const { email, password } = req.body;
    const isAdminExit = await Admin.findOne({ email });
    if (isAdminExit) {
      return res.status(200).json({ message: "Admin already exist" });
    }
    bcrypt.genSalt(saltRounds, async function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        console.log(hash);
        const data = await Admin.create({ email, password: hash });
        res.status(201).json({ message: "admin create successfuly" });
      });
    });
  } catch (error) {
    res.status(500).json({ message: "something wrong..." });
    console.error("error from HandleAdminCreate-> ", error);
  }
};
const handleAdminLogin = async (req, res) => {
  
  try {
    const result = authSchema.validate(req.body);
    if (result.error) {
      res.status(500).json({
        status: "error",
        message: result.error.message,
        responseCode: 500,
        data: null,
      });
      return;
    }
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(200).json({ message: "fill all data" });
    }

    const data = await Admin.findOne({ email });
    if (!data) {
      return res.status(200).json({ message: "admin is not exist" });
    }
    bcrypt.compare(password, data.password, function (err, result) {
      if (err) {
        console.log("error form handleAdminLogin ",err)
        return res.status(500).json({ message: "something worng..." });
      }
      if (result) {
        jwt.sign({ data }, ADMIN_JWT_SECRET, (error, token) => {
          if (error) {
            console.log("error form handleAdminLogin ",err)
            return res.status(500).json({ message: "something worng..." });
          }
          return res.status(200).json({ token });
        });
      } else {
        return res.status(200).json({ message: "password is not match" });
      }
    });
  } catch (error) {
    console.log("error from handleAdminLogin", error);
    res.status(500).json({ message: "something worng..." });
  }
};
const handleAddBlog = async (req, res) => {
  try {
    const result = blogSchema.validate(req.body);
    if (result.error) {
      res.status(500).json({
        status: "error",
        message: result.error.message,
        responseCode: 500,
        data: null,
      });
      return;
    }
    const { bigText, status, category, image, type, description, title } =
      req.body;
    const data = await Blog.create({
      bigText,
      status,
      category,
      image,
      type,
      description,
      title,
    });
    // console.log(data);
    return res.status(201).json({ message: "blog add successfully" });
  } catch (error) {
    console.log("error form handleAddBlog ->", error);
    return res.status(500).json("somthing wrong....");
  }
};
const handleEditBlog = async (req, res) => {
  try {
    const _id = req.params._id;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(200).json({ message: "id is not valid " });
    }
    const blog = await Blog.findById(_id);
    if (!blog) {
      return res.status(404).json({ message: "blog is not found" });
    }
    const updateData = req.body;
    //here one problem if user update with same data actually it's not updated but in status we updated
    const updateBlog = await Blog.updateOne(
      { _id },
      { $set: { ...updateData, status: { type: "updated", action: 3} } }
    );
    if (updateBlog.modifiedCount) {
      return res.status(200).json({ message: "Blog edited successfuly" });
    }
    return res.status(200).json({ message: "nothing to update" });
  } catch (error) {
    console.log("error form handleAddBlog ->", error);
    return res.status(500).json("somthing wrong....");
  }
};
const handleDeleteBlog = async (req, res) => {
  try {
    const _id = req.params._id;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(200).json({ message: "id is not valid " });
    }
    const blog = await Blog.findById(_id);
    if(!blog){
        return res
        .status(404)
        .json({ message: "blog is not Found" });
    }
    if (blog.status.action === -1) {
      return res
        .status(200)
        .json({ message: "blog is  already deleted" }); //remove already deleted from message
    }
    const deleteBlog = await Blog.updateOne(
      { _id },
      { $set: { status: { type: "deleted", action: -1 } } }
    );
    if (deleteBlog.modifiedCount) {
      return res.status(200).json({ message: "blog deleted successfuly " });
    }
    return res.status(404).json({ message: "blog is not found" });
  } catch (error) {
    console.log("error form handleDeleteBlog ->", error);
    res.status(500).json("somthing wrong....");
  }
};
const handleShowDeletedBlog = async (req, res) => {
  try {
    const data = await Blog.find({ "status.action": -1 }).select(
      "title description image"
    );
    res.status(200).json({ data });
  } catch (error) {
    console.log("error form handleShowDeletedBlog ->", error);
    res.status(500).json("somthing wrong....");
  }
};
const handleShowBlogByAdmin = async (req, res) => {
  try {
    let { index, category, limit,status } = req.query;
    if (!limit) {
      limit = 10;
    }
    if (!index) {
      index = 0;
    }
    const skip = index * limit;

   const query={}
   if(category){
    query['category.action']=Number(category)
   }
   if(status){
    query['status.action']=Number(status)
   }
   console.log(query)
    const data = await Blog.find(query)
      .skip(skip)
      .limit(limit)
      .select("title description image category status");
    console.log("book data length", data.length);
    // when data is empty
   if(!data.length){
    return res.status(200).json({message:"nothing bolg are present"})
   }
    const encryptText= CryptoJS.AES.encrypt(JSON.stringify(data),ENCRYPTED_SECRET_KEY).toString()
    // console.log(encryptText)
    res.status(200).json({data:encryptText})

  } catch (error) {
    console.log("error form handleShowBlog ->", error);
    res.status(500).json("somthing wrong....");
  }
};
// this only for testing 
const handleTestInjection=async(req,res)=>{
    try{
    const inputData=req.body;
   const {email,password}=req.body;
    const data=await Admin.find({email,password}).validate()
    res.status(200).json({data})
    }catch(error){
     console.log("error form handleAddBlog ->",error)
     res.status(500).json("somthing wrong....")
    }

}

module.exports = {
  HandleAdminCreate,
  handleAdminLogin,
  handleAddBlog,
  handleEditBlog,
  handleDeleteBlog,
  handleShowDeletedBlog,
  handleShowBlogByAdmin,
  handleTestInjection,
};
