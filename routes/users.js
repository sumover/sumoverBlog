const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const urlEncodeParser = bodyParser.urlencoded({extend: false});
const userService = require("../services/UserService");

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/loginStatus', urlEncodeParser, (req, res, next) => {
    if (req.session.loginUser) {
        res.json({message: "user login", username: req.session.loginUser.username});
    } else res.json({message: "user not login"});
});

router.post('/login', urlEncodeParser, async (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    let existRes = await userService.userExist(username);
    if (!existRes) {
        res.json({
            message: "user not exist"
        }).end();
    } else {
        let checkRes = await userService.userCheck(username, password);
        if (checkRes === "password error") {
            res.json({
                message: "password error"
            }).end();
        } else {
            req.session.loginUser = checkRes;
            res.json({
                message: "login success"
            }).end();
        }
    }
});

router.get('/logout', async (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
});

router.post('/register', urlEncodeParser, async (req, res, next) => {

});

router.get('/forgetpassword', urlEncodeParser, async (req, res, next) => {
    var renderOption = {title: "forget password"};
    res.render('forgetPassword', renderOption);
});

module.exports = router;
