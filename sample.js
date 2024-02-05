try{
    
}catch(error){
 console.log("error form handleAddBlog ->",error)
 res.status(500).json("somthing wrong....")
}
{
    "bigText":"test",
    "status":{"type":"blog","action":1},
    "category":{"type":"job","action":1},
    "image":"test",
    "type":"test",
    "description":"test",
    "title":"test"
    }
    "deleteBlog": {
        "acknowledged": true,
        "deletedCount": 1
    }