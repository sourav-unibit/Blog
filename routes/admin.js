const { HandleAdminCreate, handleAdminLogin, handleAddBlog, handleEditBlog, handleDeleteBlog, handleShowDeletedBlog, handleShowBlogByAdmin, handleTestInjection } = require("../controller/admin");
const isvalidAdmin = require("../middleware/admin");

const route=require("express").Router();
route.post("/admincreate",HandleAdminCreate);
route.post("/adminlogin",handleAdminLogin);
route.post("/addblog",isvalidAdmin, handleAddBlog)
route.patch("/editblog/:_id",isvalidAdmin, handleEditBlog)
route.patch("/deleteblog/:_id",isvalidAdmin, handleDeleteBlog)
route.get("/showdeletedblog",isvalidAdmin, handleShowDeletedBlog)
route.get("/showallblog",isvalidAdmin, handleShowBlogByAdmin)
route.post("/injection", handleTestInjection)
module.exports= route;
