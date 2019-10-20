var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var mysql = require('./../database');
var moment = require('./../node_modules/moment/min/moment-with-locales');


var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

/* 登录页 */
router.get('/login', function(req, res, next) {
  res.render('login',{message:''});
});

router.post('/login', function(req, res, next) {
  var name = req.body.userName;
  var password = req.body.userPwd;
  var hash = crypto.createHash('md5');
  hash.update(password);
  password = hash.digest('hex');
  console.log(password)
  var query = 'SELECT * FROM author WHERE authorName=' +mysql.escape(name) + 'AND authorPassword =' + mysql.escape(password);
  mysql.query(query, function(err, rows, fields) {
    if(err){
      console.log(err);
      return;
    }
    var user = rows[0];
    if(!user) {
      res.json({
        status: '1',
        msg:'用户名或密码错误'
      })
    }else{
      res.cookie('authorID', user.authorID, {
        path: '/',
        maxAge: 1000*60*60
      })
      res.cookie('authorName', user.authorName, {
        path: '/',
        maxAge: 1000*60*60
      })
      
      res.json({
        status: '0',
        msg:''
      })
    }
    //req.session.user = user;
    // req.session.userSign = true;
    // req.session.userID = user.authorID;
    
  });
});

router.post('/logout', function(req, res, next){
	res.cookie('authorID', "", {
		path: '/',
		maxAge: -1
  }),
  res.cookie('authorName', "", {
		path: '/',
		maxAge: -1
	})
	res.json({
		status: '0',
		msg: '',
		result: ''
	})
})

router.post('/articleContent', function(req, res, next) {
  var articleID = req.body.articleID;
  var query = 'SELECT * FROM article WHERE articleID=' + mysql.escape(articleID);
  var edit = req.body.edit
  mysql.query(query, function(err, rows, fields) {
    if(err) {
      console.log(err);
      return;
    }
    var query = 'UPDATE article SET articleClick = articleClick + 1 WHERE articleID = ' + mysql.escape(articleID);
    var article = rows[0];
    article.articleTime = moment(article.articleTime).format('YYYY-MM-DD')
    if(edit == undefined){
      mysql.query(query,function(err, rows, fields) {
        if(err) {
          console.log(err);
          return;
        }
      });
    }
    res.json({
    status: '0',
    msg: '',
    result: {article: article}
    })
  });
});

//发布编辑删除文章
router.post('/editArticle',function(req, res, next){
  var title = req.body.title;
  var content = req.body.content;
  var author = req.cookies.authorName;
  var articleID = req.body.articleID
  if(author){
    
    if(articleID){
      var query1 = 'UPDATE article SET articleTitle = ' + mysql.escape(title) + ', articleAuthor = ' + mysql.escape(author) + ', articleContent = ' + mysql.escape(content) + ', articleTime = NOW() WHERE articleID = ' + mysql.escape(articleID); 
      mysql.query(query1, function(err, rows, fields){
        if(err){
          console.log(err)
        }else{
          res.json({
            status:'0',
            msg: 'yes',
            result: 'success'
          })
        }
      });
    }

    var query = 'INSERT article SET articleTitle = ' + mysql.escape(title) + ', articleAuthor = ' + mysql.escape(author) + ', articleContent = ' + mysql.escape(content) + ', articleTime = NOW()';
    mysql.query(query, function(err, rows, fields){
      if(err){
        console.log(err)
      }else{
          res.json({
          status:'0',
          msg: 'yes',
          result: 'success'
        })
      }
    });
  }else{
    res.json({
      status: '1',
      msg: '未登录！',
      result: "failed"
    })
  }

});

//删除文章
router.post('/delete', function(req, res, next){
  var articleID = req.body.articleID;
  var query = 'DELETE FROM article WHERE articleID = ' + mysql.escape(articleID);
  mysql.query(query, function(err, rows, fields){
    if(err){
      console.log(err);
      return;
    }
    res.json({
      status: '0',
      msg:'',
      result: 'suc'
    })
  })
})

//获取评论内容
router.post('/getComment', function(req, res, next){
  var articleID = req.body.articleID;
  var sort = req.body.sort?'likes DESC':'commentTime DESC'
  var query = 'SELECT * FROM comment WHERE articleID = ' + mysql.escape(articleID) + ' ORDER BY ' + sort;
  mysql.query(query, function(err, rows, fields){
    if(err){
      console.log(query)
      res.json({
        status:'1',
        msg:err.message,
        result: ''
      })
    }else{
      var comment = []
      rows.forEach(item => {
        comment.push(item)
      })

      comment.forEach(item => {
        item.commentTime = moment(item.commentTime).startOf('hour').fromNow()
      })
      
      res.json({
        status:'0',
        msg: 'yes',
        result: {commentContent: comment}
      })
    }
  })

})
//发布评论
router.post('/publish', function(req, res, next){
  var articleID = req.body.articleID;
  var authorName = req.cookies.authorName
  var parentComment = req.body.parentComment
  var commentContent = req.body.commentContent
  if(authorName){
    var query = 'INSERT comment SET articleID = ' + mysql.escape(articleID) + ', commentContent = ' + mysql.escape(commentContent) + ', authorName = ' + mysql.escape(authorName) + ', parentComment = ' + mysql.escape(parentComment) + ', commentTime = NOW()';
    mysql.query(query, function(err, rows, fields){
      if(err){
        console.log(err)
      }else{
          res.json({
          status:'0',
          msg: 'yes',
          result: 'success'
        })
      }
    });
  }else{
    res.json({
      status: '1',
      msg: '未登录！',
      result: "failed"
    })
  }
})

//点赞
router.post('/like', function(req, res, next){
  let commentID = req.body.commentID
  let likeFlag = req.body.likeFlag
  var authorName = req.cookies.authorName
  let num = likeFlag ? 1 : -1
  if(authorName){
    var query = 'UPDATE comment SET likes = likes +' + mysql.escape(num) + ', likeFlag = ' + mysql.escape(likeFlag) + ' WHERE commentID = ' + mysql.escape(commentID);
    mysql.query(query, function(err, rows, fields){
      if(err){
        console.log(err)
      }else{
          res.json({
          status:'0',
          msg: 'yes',
          result: 'success'
        })
      }
    });
  }else{
    res.json({
      status: '1',
      msg: '未登录！',
      result: "failed"
    })
  }
})