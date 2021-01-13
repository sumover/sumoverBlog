const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const urlEncodeParser = bodyParser.urlencoded({extend: false});


//  service import
const articleService = require("../services/ArticleService");


router.get('/', urlEncodeParser,
    async (req, res, next) => {
        var tokenWord = req.query.q;
        if (tokenWord === "") {
            var renderOption = {
                title: 'searchResult',
                articleSearchResultList: []
            };
            res.render('searchResult', renderOption);
            return
        }
        var searchedArticle = await articleService.queryArticleByToken(tokenWord);
        var renderOption = {
            title: 'searchResult',
            articleSearchResultList: searchedArticle
        };
        res.render('searchResult', renderOption);
    });

module.exports = router;