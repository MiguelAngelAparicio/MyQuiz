
var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6] || null);
var user     = (url[2] || null);
var pwd      = (url[3] || null);
var protocol = (url[1] || null);
var dialect  = (url[1] || null);
var port     = (url[5] || null);
var host     = (url[4] || null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require("sequelize");

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
  { dialect: protocol,
    protocol: protocol,
    port: port,
    host: host,
    storage: storage, // solo SQLite (.env)
    omitNull: true    // solo Postgres
  }  
);

// Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, "quiz"));

// Importar la definicion de la tabla Comment en comment.js
var comment_path = path.join(__dirname, "comment");
var Comment = sequelize.import(comment_path);

// Importar la definicion de la tabla User en user.js
var user_path = path.join(__dirname, "user");
var User = sequelize.import(user_path);

// Relación 1 a N de los objetos Quiz y Comment
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Relación 1 a N de los objetos User y Quiz
// cada uno de los quizes pertenece a un usuario registrado
Quiz.belongsTo(User);
User.hasMany(Quiz);

// Exportar definicion de tablas Quiz, Comment y User
exports.Quiz = Quiz;
exports.Comment = Comment;
exports.User = User;

// sequelize.sync() crea e iniciliza tabla de preguntas en DB
sequelize.sync().then(function() {
    // then(..) ejecuta el manejador una vez creada la tabla
    User.count().then(function(count) {
        if (count === 0) {  // la tabla se inicializa solo si esta vacia
            User.bulkCreate(
                [   
                    { username:"admin" , password: "1234" , isAdmin: "true" },
                    { username:"pepe"  , password: "5678" } // isAdmin por defecto: "false"
                ]
            ).then(function() {
                console.log("Base de datos (Tabla User) inicializada");
                Quiz.count().then(function(count) {
                    if (count === 0) {      // la tabla se inicializa solo si esta vacia
                        Quiz.bulkCreate(    // estos quizes pertenecen al usuario admin (1 y 2) y pepe (3 y 4)
                            [
                                {
                                    pregunta: "¿Cúal es la capital de Grecia?",
                                    respuesta: "Atenas",
                                    tema: "Humanidades",
                                    UserId: 1
                                },
                                {
                                    pregunta: "¿Cúal es la capital de Portugal?",
                                    respuesta: "Lisboa",
                                    tema: "Humanidades",
                                    UserId: 1
                                },
                                {
                                    pregunta: "¿Cúal es la ciudad de las Tres Culturas?",
                                    respuesta: "Toledo",
                                    tema: "Humanidades",
                                    UserId: 2
                                },
                                {
                                    pregunta: "¿Quién fue el fundador de Apple?",
                                    respuesta: "Steve Jobs",
                                    tema: "Tecnología",
                                    UserId: 2
                                }
                            ]
                        ).then(function() {console.log("Base de datos (Tabla Quiz) inicializada")});
                    };
                });
            });
        };
    });
});