var models = require("../models/models.js");

// GET /quizes
exports.index = function (req, res) {
    models.Quiz.findAll().then(function (quizes) {
        res.render("quizes/index", { quizes: quizes });
    })
};

// GET /quizes/:id
exports.show = function(req,res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		res.render("quizes/show" , {quiz: quiz});		
	})
};

// GET /quizes/:id/answer
exports.answer = function(req,res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		if (req.query.respuesta.toLowerCase() === quiz.respuesta.toLowerCase()) {
			res.render("quizes/answer" , {quiz: quiz, respuesta: "CORRECTO"});
		} else {
			res.render("quizes/answer" , {quiz: quiz, respuesta: "INCORRECTO"});
		}		
	})
};