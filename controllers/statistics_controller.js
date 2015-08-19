var models = require("../models/models.js");

var stats = {
    preguntas: 0,
    comments: 0,
    media: 0,
    pregConComments: 0,
    pregSinComments: 0,
    commentsPublicados: 0,
    commentsSinPublicar: 0
};


exports.calculate = function(req, res, next) {
    stats.preguntas= 0;
    stats.comments= 0;
    stats.media= 0;
    stats.pregConComments= 0;
    stats.pregSinComments= 0;
    stats.commentsPublicados= 0;
    stats.commentsSinPublicar= 0;

    Promise.all([
        models.Quiz.count(),
        models.Comment.count(),
        models.Quiz.findAll({
            include: [{model: models.Comment}]
        })    

    ]).then(function(datos) {
        stats.preguntas = datos[0];             // numero total de preguntas
        stats.comments = datos[1];              // numero total de comentarios

        if (stats.preguntas && stats.comments)
            {stats.media = (stats.comments/stats.preguntas).toFixed(2);}    // media de comentarios por pregunta
        else {stats.media = 0;};

        for (var i in datos[2]) {
            if (datos[2][i].Comments.length > 0) {
                stats.pregConComments++;                            // nº total de preguntas con algun comentario
                for (var index in datos[2][i].Comments) {
                    if (datos[2][i].Comments[index].publicado) {
                        stats.commentsPublicados++;                 // nº total de comentarios publicados
                    } else { stats.commentsSinPublicar++;}          // comentarios sin publicar
                }
            } else { stats.pregSinComments++;}                      // preguntas sin comentarios
        }

    }).then(next, next);
};

// GET /quizes/statistics  (muestra la pagina de estadisticas - show.ejs)
exports.show = function (req, res) {
	res.render("quizes/statistics/show" , {stats: stats, errors: [] });		
};


