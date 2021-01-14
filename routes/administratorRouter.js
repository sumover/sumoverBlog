//
//  article.js
//  http://localhost:3000/article/
//

const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const urlEncodeParser = bodyParser.urlencoded({extend: false});
const AppConfig = require("../app-config");
const moment = require('moment');

//  service import
const userService = require('../services/UserService');

router.get('/', urlEncodeParser,
    async (req, res, next) => {
        var loginUser = req.session.loginUser;
        if (loginUser === undefined || loginUser === null) {
            res.redirect('/');
            return
        }
        const userRole = await userService.userRole(loginUser);
        if (userRole === "admin") {
            res.render('administrator', {
                title: 'admin management'
            });
        } else {
            res.redirect('/');
        }
    });

module.exports = router;