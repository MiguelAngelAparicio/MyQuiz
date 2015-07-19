
var path = require('path');

// Cargar Modelo ORM
var Sequelize = require("sequelize");

// Usar BBDD SQLite
var sequelize = new Sequelize(null, null, null,
                {dialect: "sqlite", storage: "quiz.sqlite"});

// Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, "quiz"));

// Exportar definicion de tabla Quiz
exports.Quiz = Quiz;

// sequelize.sync() crea e iniciliza tabla de preguntas en DB
sequelize.sync().sucess(function() {
    // success(..) ejecuta el manejador una vez creada la tabla    
    Quiz.count().sucess(function(count){
        if(count === 0) {  // la tabla se inicializa solo si esta vacia
            Quiz.create({ pregunta: "¿Cúal es la capital de Grecia?",
                          respuesta: "Atenas"})
            .sucess(function(){console.log("Base de datos inicializada")});
        };
    });
});