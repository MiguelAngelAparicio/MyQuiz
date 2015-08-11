// Definicion del modelo de Comment con validacion

module.exports = function (sequelize, DataTypes) {
	return sequelize.define("Comment", {
		texto: { 
            type: DataTypes.STRING,
            validate: { notEmpty: {msg: "--> Rellena el campo Comentario <--"}}
        }
    });
};