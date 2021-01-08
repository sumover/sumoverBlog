const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const urlEncodeParser = bodyParser.urlencoded({extend: false});

router.get('/', urlEncodeParser, async (req, res, next) => {
    var renderOption = {
        title: 'searchResult',
    }

    res.render('searchResult', renderOption);
});

module.exports = router;