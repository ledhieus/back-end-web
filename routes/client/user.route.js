const express = require('express');
const router = express.Router();

const controller = require("../../controllers/client/user.controller")
const validate = require("../../validates/client/user.validates")

router.get('/register', controller.register);

router.post('/register',validate.registerPost, controller.registerPost);

router.get('/login', controller.login);

router.post('/login',validate.loginPost, controller.loginPost);

router.get('/logout', controller.logout);

router.get('/password/forgot', controller.forgotPassword);

router.post('/password/forgot',validate.forgotPassword, controller.forgotPasswordPost);




module.exports = router;