var models = require("../models/models.js");

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function (req, res, next, quizId) {
    models.Quiz.find({
        where: { id: Number(quizId) },
        include: [{ model: models.Comment }]        
    }).then(
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
            {where: [ "lower(pregunta) like lower(?)", "%"+req.query.search.split(" ").join("%")+"%" ]}  
        ).then(function(quizes) {
            res.render("quizes/index.ejs" , { quizes: quizes.sort(), errors: [] });
        }).catch(function(error) {next(error);})
    } else {  // si no se ha pasado nada en el cuadro de busqueda muestra la tabla completa de preguntas
        models.Quiz.findAll().then(function (quizes) {
            res.render("quizes/index.ejs", { quizes: quizes, errors: [] });
        })
        .catch(function(error) { next(error); });
    };
}
// GET /quizes/:id  (muestra la pagina de pregunta - show.ejs)
exports.show = function(req,res) {
	res.render("quizes/show" , {quiz: req.quiz, errors: [] });		
};

// GET /quizes/:id/answer  (muestra la pagina de respuesta - answer.ejs)
exports.answer = function(req,res) {
	if (req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()) {
		res.render("quizes/answer" , {quiz: req.quiz, respuesta: "CORRECTO", errors: [] });
	} else {
		res.render("quizes/answer" , {quiz: req.quiz, respuesta: "INCORRECTO", errors: [] });
	}		
};

// GET /quizes/new
exports.new = function(req,res) {
    var quiz = models.Quiz.build (  // crea objeto quiz
        {pregunta: "Escriba una pregunta", respuesta: "Escriba la respuesta", tema: "Otro"}
    );
    res.render("quizes/new", {quiz: quiz, errors: [] });
};

// POST /quizes/create
exports.create = function(req,res) {
    var quiz = models.Quiz.build(req.body.quiz);

    quiz.validate().then(function(err){
            if (err) {
                res.render('quizes/new', {quiz: quiz, errors: err.errors});
            } else { // save: guarda en DB campos pregunta y respuesta de quiz
                quiz.save( { fields: [ "pregunta", "respuesta", "tema"] } ).then( function() {
                res.redirect('/quizes');});     // res.redirect: Redirección HTTP a lista de preguntas
            }
        }
    ).catch(function(error) {next(error);});
}; 

// GET /quizes/:id/edit
exports.edit = function(req,res) {
    var quiz =req.quiz; // autoload carga la instancia de quiz
    res.render("quizes/edit", {quiz: quiz, errors: []});
};

//PUT /quizes/:id
exports.update = function(req,res) {
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.tema = req.body.quiz.tema;

    req.quiz
        .validate()
        .then(function(err) {
            if  (err) {
                res.render("quizes/edit", { quiz: req.quiz, errors: err.errors});
            } else {
                req.quiz.save( { fields: [ "pregunta", "respuesta", "tema" ] } ) // save: guarda campos pregunta, respuesta y tema en BBDD
                .then( function() { res.redirect('/quizes');});     // res.redirect: Redirección HTTP a lista de preguntas
            }
        });
};

// DELETE /quizes/:id
exports.destroy = function(req,res) {
    req.quiz.destroy().then( function() {
        res.redirect("/quizes");
    }).catch(function(error) {next(error);});
};