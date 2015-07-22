var models = require("../models/models.js");

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function (req, res, next, quizId) {
    models.Quiz.find(quizId).then(
        function (quiz) {
            if (quiz) {
                req.quiz = quiz;
                next();
            } else { next(new Error("No existe quizId = " + quizId)); }
        })
        .catch(function(error) { next(error); });
}; 

// GET /quizes  (muestra la pagina principal con la tabla de preguntas - index.ejs)
exports.index = function (req, res) {
    if (req.query.search) {  // si hay algo para buscar en el query muestra las preguntas ya filtradas y ordenadas
        models.Quiz.findAll(
            // añadimos los % para que acepte espacios en blanco o cualquier otra cosa, hace de comodin
            {where: [ "lower(pregunta) like lowewr(?)", "%"+req.query.search.split(" ").join("%")+"%" ]}  
        ).then(function(quizes) {
            res.render("quizes/index" , { quizes: quizes.sort() });
        }).catch(function(error) {next(error);})
    } else {  // si no se ha pasado nada en el cuadro de busqueda muestra la tabla completa de preguntas
        models.Quiz.findAll().then(function (quizes) {
            res.render("quizes/index", { quizes: quizes });
        })
        .catch(function(error) { next(error); })
    };
}
// GET /quizes/:id  (muestra la pagina de pregunta - show.ejs)
exports.show = function(req,res) {
	res.render("quizes/show" , {quiz: req.quiz});		
};

// GET /quizes/:id/answer  (muestra la pagina de respuesta - answer.ejs)
exports.answer = function(req,res) {
	if (req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()) {
		res.render("quizes/answer" , {quiz: req.quiz, respuesta: "CORRECTO"});
	} else {
		res.render("quizes/answer" , {quiz: req.quiz, respuesta: "INCORRECTO"});
	}		
};
