const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const requireLogin = require('../middleware/requireLogin')
const joi = require('joi')


router.get('/api/test', async (req, res) => {
    try {
        return res.status(200).json("api/test")
    }
    catch (error) {
        console.log(error)
        return res.status(500).send("500 Internal server error")
    }
})


/*=====================================================================================
                                    GET ALL POST
=====================================================================================*/
router.get('/api/post', requireLogin, async (req, res) => {
    try {
        const post = await Post.find()
            .populate("postedBy", "_id name")
            .populate("comments.commentedBy", "_id name")
        return res.status(200).json({ post })
    }
    catch (error) {
        console.log(error)
        return res.status(500).send("500 Internal server error")
    }
})


/*=====================================================================================
                                    CREATE NEW POST
=====================================================================================*/
const createpostSchema = joi.object({
    title: joi.string().min(1).max(50).required(),
    body: joi.string().min(1).max(100).required(),
    image_url: joi.string().required()
})

router.post('/api/post', requireLogin, async (req, res) => {
    const { error, value } = createpostSchema.validate(req.body)
    if (error) {
        return res.status(422).json({ error: error.details[0].message })
    }

    try {
        const { title, body, image_url } = value
        const user = req.user
        user.password = undefined

        const postObj = new Post({
            title,
            body,
            photo: image_url,
            postedBy: user
        })

        const post = await postObj.save()
        return res.status(201).json({ post })
    }
    catch (error) {
        console.log(error)
        return res.status(500).send("500 Internal server error")
    }
})


/*=====================================================================================
                                    GET MY POST
=====================================================================================*/
router.get('/api/post/my', requireLogin, async (req, res) => {
    const { _id } = req.user

    try {
        const post = await Post.find({ postedBy: _id }).populate("postedBy", "_id name")
        return res.status(200).json({ post })
    }
    catch (error) {
        console.log(error)
        return res.status(500).send("500 Internal server error")
    }
})


/*=====================================================================================
                                        LIKE
=====================================================================================*/
const likeSchema = joi.object({
    postId: joi.string().length(24).hex().required()
});

router.put('/api/post/like', requireLogin, async (req, res) => {
    const { error, value } = likeSchema.validate(req.body);
    if (error) {
        return res.status(422).json({ error: error.details[0].message })
    }

    try {
        const { postId } = value
        const { _id } = req.user

        const post = await Post.findByIdAndUpdate(
            postId,
            { $addToSet: { likes: _id } }, // add like only once 
            { new: true }
        )  
        .populate("postedBy", "_id name")
        .populate("comments.commentedBy", "_id name")

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        return res.status(200).json({ post })

    } catch (error) {
        console.log(error)
        return res.status(500).send("500 Internal server error")
    }
})


/*=====================================================================================
                                        UNLIKE
=====================================================================================*/
const unlikeSchema = joi.object({
    postId: joi.string().length(24).hex().required()
});

router.put('/api/post/unlike', requireLogin, async (req, res) => {
    const { error, value } = unlikeSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }

    const { postId } = value
    const { _id } = req.user

    try {
        const post = await Post.findByIdAndUpdate(
            postId,
            { $pull: { likes: _id } },
            { new: true })
            .populate("postedBy", "_id name")
            .populate("comments.commentedBy", "_id name")

        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        return res.status(200).json({ post })

    } catch (error) {
        console.log(error)
        return res.status(500).send("500 Internal server error")
    }

})


/*=====================================================================================
                                        COMMENT
=====================================================================================*/
const commentSchema = joi.object({
    postId: joi.string().length(24).hex().required(),
    text: joi.string().min(3).max(100).required()
});

router.put('/api/post/comment', requireLogin, async (req, res) => {
    const { error, value } = commentSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }

    const { postId, text } = value
    const { _id } = req.user

    comment = {
        text,
        commentedBy: _id
    }

    try {
        const post = await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: comment } },
            { new: true })
            .populate("postedBy", "_id name")
            .populate("comments.commentedBy", "_id name")

        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        return res.status(200).json({ post })
    }
    catch (error) {
        console.log(error)
        return res.status(500).send("500 Internal server error")
    }
})

/*=====================================================================================
                                        DELETE
=====================================================================================*/
const deleteSchema = joi.object({
    postId: joi.string().length(24).hex().required(),
});

router.delete('/api/post/:postId', requireLogin, async (req, res) => {
    const { error, value } = deleteSchema.validate(req.params)
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }

    const { postId } = value
    const { _id } = req.user

    try {
        const post = await Post.findOne({ _id: postId }).populate("postedBy", "_id")
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.postedBy._id.toString() !== _id.toString()) {
            return res.status(403).json({ message: "You can not delete this post" })
        }
        
        await post.remove()
        return res.status(200).json({ message: "Post delete successful" })
    }
    catch (error) {
        console.log(error)
        return res.status(500).send("500 Internal server error")
    }
})

module.exports = router
