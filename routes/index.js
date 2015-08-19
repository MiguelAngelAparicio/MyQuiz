var express = require('express');
var router = express.Router();

var quizController         = require("../controllers/quiz_controller");
var commentController      = require("../controllers/comment_controller");
var sessionController      = require("../controllers/session_controller");
var statisticsController   = require("../controllers/statistics_controller")

/* GET home page. - pagina de bienvenida - index.ejs*/
router.get('/', function(req, res) {
  res.render('index', { title: 'MyQuiz', errors: []  });
});

// Autoload de comandos con :quizId
router.param("quizId", quizController.load);  // autoload :quizId
router.param("commentId", commentController.load);  // autoload :commentId

// Definicion de rutas de sesion
router.get("/login",          sessionController.new);         // pagina de formulario para logarse  
router.post("/login",         sessionController.create);      // crear sesion
router.delete("/login",       sessionController.destroy);     // destruir sesion


// Definición de rutas de /quizes
router.get('/quizes',                      quizController.index);  // pagina para mostrar todas las preguntas
router.get('/quizes/:quizId(\\d+)',        quizController.show);   // pagina para responder a la pregunta elegida
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer); // pagina de respuesta correcta o incorrecta
router.get("/quizes/new" ,                 sessionController.loginRequired, quizController.new);    // pagina formulario de nueva pregunta
router.post("/quizes/create" ,             sessionController.loginRequired, quizController.create); // post para añadir preg a BBDD
router.get("/quizes/:quizId(\\d+)/edit",   sessionController.loginRequired, quizController.edit);   // pagina para editar pregunta
router.put("/quizes/:quizId(\\d+)",        sessionController.loginRequired, quizController.update); // put para modificar BBDD
router.delete("/quizes/:quizId(\\d+)",     sessionController.loginRequired, quizController.destroy);// delete para borrar pregunta de la BBDD

// pagina autor ejercicio modulo 6
router.get("/author" , function(req,res) {
	res.render("author" , {autor: "Miguel Ángel Aparicio", errors: [] });  // pagina de creditos
});

// Definicion de rutas de comentarios:
router.get("/quizes/:quizId(\\d+)/comments/new",                        commentController.new);
router.post("/quizes/:quizId(\\d+)/comments"   ,                        commentController.create);
router.put("/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish",   sessionController.loginRequired, commentController.publish);
router.delete("/quizes/:quizId(\\d+)/comments/:commentId(\\d+)",        sessionController.loginRequired, commentController.destroy);

// pagina estadisticas ejercicio modulo 9
router.get("/quizes/statistics" ,                                       statisticsController.calculate, statisticsController.show);

module.exports = router;