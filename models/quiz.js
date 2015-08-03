// Definicion del modelo de Quiz

module.exports = function (sequelize, DataTypes) {
	return sequelize.define("Quiz", {
		pregunta: { 
            type: DataTypes.STRING,
            validate: { notEmpty: {msg: "--> Rellena el campo Pregunta"}}
        },
		respuesta: {
            type: DataTypes.STRING,
            validate: { notEmpty: {msg: "--> Rellena el campo Respuesta"}}
        }
	});
};