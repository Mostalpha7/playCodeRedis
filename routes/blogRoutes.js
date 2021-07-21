const express = require("express");
const router = express.Router();
const redis = require("redis");
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
const util = require("util");
client.get = util.promisify(client.get);

const cleanCache = require("../middlewares/cleanCache");
const { BlogSchema } = require("../models");

router.get("/:id", async(req, res) => {
    const blog = await BlogSchema.findOne({
        _user: req.user.id,
        _id: req.params.id,
    });
    if (blog) {
        return res.send(blog);
    }

    return res.send("Post not found!");
});

router.get("/", async(req, res) => {
    const blogs = await BlogSchema.find({ _user: req.user.id }).cache({
        key: req.user.id,
    });
    return res.send(blogs);
});

router.post("/", cleanCache, async(req, res) => {
    const { title, content } = req.body;

    const blog = new BlogSchema({
        title,
        content,
        _user: req.user._id,
    });

    try {
        await blog.save();
        res.send(blog);
    } catch (err) {
        res.send(400, err);
    }
});

module.exports = router;