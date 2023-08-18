
const User = require('../models/user')
const Message = require('../models/message')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");

exports.message_list = asyncHandler ( async (req, res, next) => {
    const allMessages = await Message.find({}).populate('poster').exec()
    res.render('message-list', {title: "Board", post_list: allMessages})
})

exports.message_detail = asyncHandler( async (req, res, next) => {
    const message = await Message.findById(req.params.id).populate('poster').exec()
    if (message === null) {
        const err = new Error ('Post not found')
        err.status = 404
        return next(err)
    }
    res.render('message-detail', {title: message.title, post: message})
})

exports.message_create_get = asyncHandler ( async (req, res, next) => {
    res.render('message-form', {title: 'Create a post'})
})

exports.message_create_post = [
    body('title', "Title must be at least 2 characters").trim().isLength(2).escape(),
    body('message', "Message must be at least 2 characters").trim().isLength(2).escape(),
    asyncHandler (async (req, res, next) => {
        const errors = validationResult(req)
        const message = new Message ( {
            poster: req.user._id,
            title: req.body.title,
            message: req.body.message
        })
        if (!errors.isEmpty()) {
            res.render('message-form', {title: 'Create a post', message: message, errors: errors.array()})
            return
        } else {
            await message.save()
            res.redirect(message.url)
        }
    })
]
/*
exports.message_delete_get

exports.message_delete_post

exports.message_update_get

exports.message_update_post

*/