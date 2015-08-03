var express = require('express');
var router = express.Router();

var quizController = require("../controllers/quiz_controller");

/* GET home page. - pagina de bienvenida - index.ejs*/
router.get('/', function(req, res) {
  res.render('index', { title: 'MyQuiz', errors: []  });
});

// Autoload de comandos con :quizId
router.param("quizId", quizController.load);  // autoload :quizId

// Definición de rutas de /quizes (antiguos question y answer)
router.get('/quizes',                      quizController.index);  // pagina con todas las preguntas
router.get('/quizes/:quizId(\\d+)',        quizController.show);   // pagina para responder a la pregunta elegida
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer); // pagina de respuesta correcta o incorrecta

// paginas para nueva pregunta
router.get("/quizes/new" ,                 quizController.new);    // pagina formulario de nueva pregunta
router.post("/quizes/create" ,             quizController.create); // post para añadir preg a BBDD

// pagina autor ejercicio modulo 6
router.get("/author" , function(req,res) {
	res.render("author" , {autor: "Miguel Ángel Aparicio", errors: [] });  // pagina de creditos
});

module.exports = router;
