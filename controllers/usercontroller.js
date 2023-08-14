const User = require('../models/user')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");

exports.user_create_get = asyncHandler ( async (req, res, next) => { 
    res.render('sign-up-form', { title: 'Sign up page' });
})

exports.user_create_post = [
    body('email', "Email must be at least 3 characters.").trim().isLength({min: 2}).escape(),
    body('first_name', 'First name must be at least 2 characters.').trim().isLength({min:3}).escape(),
    body('last_name', "Last name must be at least 2 characters.").trim().isLength({min: 3}).escape(),
    body('password', "Password must be at least 3 characters").trim().isLength({min:3}).escape(),
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
        /*
        const errors = validationResult(req)
        const user = new User( {
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password,
        })
        if (!errors.isEmpty()) {
            res.render('sign-up-form', {title: "Create a new user", user: user, errors: errors.array() })
            console.log('error')
            return
        } else {
        await user.save()
        res.redirect('/board')
        }
        */
}
)]

