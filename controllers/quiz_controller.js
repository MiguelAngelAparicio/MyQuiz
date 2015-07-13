// GET /quizes/question
exports.question = function(req , res) {
	res.render("quizes/question" , {pregunta: "Capital de Italia"});	
};

// GET /quizes/answer
exports.answer = function (req , res) {
	if (req.query.respuesta.tolowerCase === "roma") {
		res.render("quizes.answer" , {respuesta: "CORRECTO"});
	} else {
		res.render("quizes.answer" , {respuesta: "INCORRECTO"});
	}
};