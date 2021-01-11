var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: '猫窝大门',
        isIndex: true
    });
});

router.get('/about', async (req, res, next) => {
    res.render('about', {
        title: "猫窝说明",
        isAbout: true
    });
});
module.exports = router;