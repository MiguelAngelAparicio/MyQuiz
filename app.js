var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require("express-partials");
var methodOverride = require("method-override");
var session = require("express-session");

var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser("MyQuiz"));
app.use(session());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());

// Helpers dinamicos:
app.use(function(req, res, next) {

    //guardar path en session.redir para redirigir tras el login
    if (req.method === 'GET' && !req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
    }

    //Hacer visible req.session en las vistas
    res.locals.session = req.session;
    next()
});

// MW de Auto Logout - Controla el tiempo entre transacciones
app.use( function(req, res, next) {
  if ( req.session.user ) {                             // si hay sesion
    var actual = new Date();                            // tiempo actual
    var ultima = new Date( req.session.user.ultima );   // tiempo de la ultima transaccion
    if ( ( actual - ultima ) > 120000 ) {               // si el tiempo entre actual y ultima es mayor de 2 minutos
        delete req.session.user;                        // eliminamos sesion
        req.session.errors = [ { "message": 'Sesión finalizada, vuelva a logarse, por favor' } ]; // mensaje al usuario
        res.redirect("/login");                         // redireccionamos a la pantalla de login
        return;
    } else {                                            // si el tiempo es inferior a 2 minutos
        req.session.user.ultima = new Date();           // reiniciamos la variable ultima con el tiempo actual
    }
  }
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: [] 
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: [] 
    });
});


module.exports = app;
