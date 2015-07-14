var express = require('express');
var router = express.Router();

var quizController = require("../controllers/quiz_controller");

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'MyQuiz' });
});

router.get("/quizes/question" , quizController.question);
router.get("/quizes/answer" , quizController.answer);

router.get("/author" , function(req,res) {
	res.render("author" , {autor: "Miguel Ángel Aparicio"});
});

module.exports = router;
