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
        res.json({message: "user login", loginUser: req.session.loginUser});
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
    var username = req.body.username;
    var password = req.body.password;
    var inviteCode = req.body.inviteCode;
    if (await userService.userExist(username)) {
        console.log(`user ${username} already exist!`);
        res.json({message: 'user already exist'});
        return
    }
    console.log(`user ${username} not exist!`);
    if (!(await userService.inviteCodeCheck(inviteCode))) {
        console.log(`invite code ${inviteCode} incorrect!`);
        res.json({message: 'invite code error'});
        return
    }
    console.log(`invite code ${inviteCode} correct!`);
    var userAdded = await userService.userAdd(username, password, inviteCode);
    console.log(`user ${JSON.stringify(userAdded)} create!`);
    res.json({message: 'register success'}).end();
});

router.get('/forgetpassword', urlEncodeParser, async (req, res, next) => {
    var renderOption = {title: "forget password"};
    res.render('forgetPassword', renderOption);
});

router.get('/inviteCode/:id', async (req, res, next) => {
    if (typeof (req.session.loginUser) === "undefined") {
        res.json({message: "please login first"}).end();
        return
    }
    var userId = req.params.id;
    var inviteCodes = await userService.fetchInviteCode(userId);
    res.json({
        inviteCodes: inviteCodes,
        message: "fetch invite code success"
    });
});

module.exports = router;
