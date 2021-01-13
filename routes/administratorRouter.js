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

router.get('/', urlEncodeParser,
    async (req, res, next) => {
        res.end('23333333');
    });

module.exports = router;