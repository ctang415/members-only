/*
const User = require('../models/user')
const Message = require('../models/message')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");

exports.message_list = asyncHandler ( async (req, res, next) => {
    const allMessages = await Message.find({}).populate('user').exec()
    res.render('post-list', {title: "Board", post_list: allMessages})
})

exports.message_detail = asyncHandler( async (req, res, next) => {
    const message = await Message.findById(req.params.id).populate('user').exec()
    if (message === null) {
        const err = new Error ('Post not found')
        err.status = 404
        return next(err)
    }
    res.render('post-detail', {title: message.title, post: message})
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
            poster: 
            title: req.body.title,
            message: req.body.message
        })
    })
]

exports.message_delete_get

exports.message_delete_post

exports.message_update_get

exports.message_update_post

*/