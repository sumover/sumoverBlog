const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const urlEncodeParser = bodyParser.urlencoded({extend: false});


router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/login', urlEncodeParser, async (req, res, next) => {

});

router.post('/register', urlEncodeParser, async (req, res, next) => {

});

router.get('/forgetpassword', urlEncodeParser, async (req, res, next) => {
    var renderOption = {title: "forget password"};
    res.render('forgetPassword', renderOption);
});

module.exports = router;
