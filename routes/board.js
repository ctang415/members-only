var express = require('express');
var router = express.Router();

const message_controller = require('../controllers/messagecontroller')
const user_controller = require('../controllers/usercontroller')

router.get('/user/sign-up', user_controller.user_create_get)

router.post('/user/sign-up', user_controller.user_create_post)

router.get('/users', user_controller.user_list)

router.get('/user/:id', user_controller.user_detail)


router.get('/user/:id/delete', user_controller.user_delete_get)

router.post('/user/:id/delete', user_controller.user_delete_post)

router.get('/user/:id/update', user_controller.user_update_get)

router.post('/user/:id/update', user_controller.user_update_post)

router.get('/messages', message_controller.message_list)

router.get('/message/create', message_controller.message_create_get)

router.post('/message/create', message_controller.message_create_post)

router.get('/message/:id', message_controller.message_detail)

router.get('/message/:id/delete', message_controller.message_delete_get)

router.post('/message/:id/delete', message_controller.message_delete_post)

router.get('/message/:id/update', message_controller.message_update_get)

router.post('/message/:id/update', message_controller.message_update_post)


module.exports = router;
