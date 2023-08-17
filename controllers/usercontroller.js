const User = require('../models/user')
const Message = require('../models/message')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");

exports.user_list = asyncHandler ( async (req, res, next) => {
    const allUsers = await User.find().sort({email: 1}).exec()
    res.render('user-list', {title: "All users", user_list: allUsers })
})

exports.user_detail = asyncHandler ( async (req, res, next) => {
    const [user, postsByUser] = await Promise.all ([
        User.findById(req.params.id).exec(),
        Message.find({email : req.params.id}, "messages").exec()
    ])
    if (user === null) {
        const err = new Error('User does not exist')
        err.status = 404;
        return next(err)
    }
    res.render('user-detail', {title: "Profile", user: user, user_posts: postsByUser})
})

exports.user_create_get = asyncHandler ( async (req, res, next) => { 
    res.render('sign-up-form', { title: 'Create a new user' });
})

exports.user_create_post = [
    (req, res, next) => {
        if (req.body.admin === 'on') {
            req.body.admin = true
    } else {
        req.body.admin = false
    }
    next() 
    },
    body('email', "Email already exists").custom( async value => {
        const existingUser = await User.findOne( {email: value})
        if (existingUser) {
            throw new Error('Email already exists')
        }
    }),
    body('email', "Email must be at least 3 characters.").trim().isLength({min: 2}).escape(),
    body('first_name', 'First name must be at least 2 characters.').trim().isLength({min:2}).escape(),
    body('last_name', "Last name must be at least 2 characters.").trim().isLength({min: 2}).escape(),
    body('password', "Password must be at least 3 characters").trim().isLength({min:3}).escape(),
    body('passwordConfirmation', "Passwords do not match").custom((value, { req }) => {
        return value === req.body.password;
      }),
    body('admin').escape(),
    asyncHandler(async( req, res, next ) => {
        try {
            bcrypt.hash(req.body.password, 10, async (err, hash) => {
                if (err) {
                    return err
                }
            const errors = validationResult(req)
            const user = new User( {
                email: req.body.email,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                password: hash,
                admin: req.body.admin,
            })
            if (!errors.isEmpty()) {
                res.render('sign-up-form', {title: "Create a new user", user: user, errors: errors.array() })
                return
            } else {
            await user.save()
            res.redirect('/board')
            }
            })
        } catch (err) {
            return next(err)
        }
}
)]

exports.user_delete_get = asyncHandler ( async (req, res, next) => {
    const [ user, allPostsByUser] = await Promise.all ( [
        User.findById(req.params.id).exec(),
        Message.find({user: req.params.id}).exec()
    ])
    if (user === null) {
        res.redirect('/board/users')
    }
    res.render('user-delete', {title: 'Delete a user', user:user, post_list: allPostsByUser})
})

exports.user_delete_post = asyncHandler ( async (req, res, next) => {
    const [ user, allPostsByUser] = await Promise.all ( [
        User.findById(req.params.id).exec(),
        Message.find({user: req.params.id}).exec()
    ])
    if (allPostsByUser.length > 0) {
        res.render('user-delete', { title: "Delete a user", user:user, post_list: allPostsByUser})
    } else {
        await User.findByIdAndRemove(req.body.userid)
        res.redirect('/board/users')
    }
})

exports.user_update_get = asyncHandler ( async (req, res, next ) => {
    const [ user, allPostsByUser] = await Promise.all(
        [
            User.findById(req.params.id).populate('message').exec(),
            Message.find({email: req.params.id}).exec()
        ]
    )
    if (user === null) {
        const err = new Error("User not found")
        err.status = 404
        return next(err)
    }
    res.render('sign-up-form', {title: "Update user profile", user:user, post_list: allPostsByUser})
})

exports.user_update_post = [
    body('email', "Email must be at least 3 characters.").trim().isLength({min: 2}).escape(),
    body('first_name', 'First name must be at least 2 characters.').trim().isLength({min:3}).escape(),
    body('last_name', "Last name must be at least 2 characters.").trim().isLength({min: 3}).escape(),
    body('password', "Password must be at least 3 characters").trim().isLength({min:3}).escape(),
    asyncHandler ( async (req, res, next) => {
        try {
            bcrypt.hash(req.body.password, 10, async (err, hash) => {
                if (err) {
                    return err
                }
            const errors = validationResult(req)
            const user = new User( {
                email: req.body.email,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                password: hash,
                _id: req.params.id
            })
            if (!errors.isEmpty()) {
                res.render('sign-up-form', {title: "Update profile information", user: user, errors: errors.array() })
                return
            } else {
                const updatedUser = await User.findByIdAndUpdate(req.params.id, user, {})
                res.redirect(updatedUser.url)
            }
            })
        } catch (err) {
            return next(err)
        }
}) 
]

