var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs')

const message_controller = require('../controllers/messagecontroller')
const user_controller = require('../controllers/usercontroller')
const User = require('../models/user')

router.get('/user/sign-up', user_controller.user_create_get )

router.post('/user/sign-up', user_controller.user_create_post)

module.exports = router;
