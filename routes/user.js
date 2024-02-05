const { handleShowBlog, handleShowDetails, handleShowLatestBlog, handlePhoneNumberValid, handleSignUp, handleSignIn, handleAddFavouriteBlog, handleDecryptData, handleSearch } = require("../controller/user");
const isvalidUser = require("../middleware/user");

const route=require("express").Router();
route.get('/',handleShowBlog)
route.get('/blog/:_id',handleShowDetails)
route.get('/latestblog',handleShowLatestBlog)
route.post('/number',handlePhoneNumberValid)
route.post('/signup',handleSignUp)
route.post('/signin',handleSignIn)
route.post('/favourite/:_id',isvalidUser, handleAddFavouriteBlog)
route.post('/decryptdata', handleDecryptData)
route.get('/search/:value', handleSearch)

module.exports=route