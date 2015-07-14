// GET /quizes/question
exports.question = function(req,res) {
	res.render("quizes/question" , {pregunta: "¿Cuál es la Capital de Grecia?"});	
};

// GET /quizes/answer
exports.answer = function(req,res) {
	if (req.query.respuesta.toLowerCase() === "atenas") {
		res.render("quizes/answer" , {respuesta: "CORRECTO"});
	} else {
		res.render("quizes/answer" , {respuesta: "INCORRECTO"});
	}
};