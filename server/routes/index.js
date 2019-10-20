var express = require('express');
var router = express.Router();
var mysql = require('./../database');
var moment = require('moment');


var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
/* GET home page. */
router.get('/index', function(req, res, next) {
  let user = req.cookies.authorName
  let page = parseInt(req.query.page)
  let pageSize = parseInt(req.query.pageSize)
  let skip = (page-1)*pageSize
  let query = 'SELECT * FROM article ORDER BY articleID DESC LIMIT ' + skip+',' +pageSize ;
  console.log(query)
  mysql.query(query, function(err, rows, fields) {
    var articles = rows;
    articles.forEach( item => {
      item.articleTime = moment(item.articleTime).format("YYYY-MM-DD")
    })
    if(err){
      res.json({
        status: '1',
        msg:'err.message'
      })
    }else{
      res.json({
        status: '0',
        msg:'',
        result: {articles: articles, user: user ,count: articles.length}
      })
    }
  });
});

//获取文章内容




module.exports = router;
