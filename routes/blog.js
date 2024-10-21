const { Router } = require("express");
const multer = require("multer");
const router = Router();
const path = require("path");

const Blog = require("../models/blog");
const Comment = require("../models/comments");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/upload/`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
})

const upload = multer({ storage: storage })

router.get("/add-new", (req, res) => {
    return res.render("addBlog", {
        user: req.user  
    });
});

router.get("/:id", async(req, res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    console.log(blog);
    return res.render("blog", {
        blog,
        user: req.user
    });
});

router.post("/comment/:blogId", async(req, res) => {
    await Comment.create({
        content: req.body.content,
        createdBy: req.user._id,
        blogId: req.params.blogId
 
    })
    return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/", upload.single("coverImageURL"), async(req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        title,
        body,
        coverImageURL: `/upload/${req.file.filename}`,
        createdBy: req.user._id
    })
    return res.redirect(`/blog/${blog._id}`);
}); 


module.exports = router;
