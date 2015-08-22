var models = require("../models/models.js");

// Comprueba si el usuario esta registrado en users
// Si la autenticacion falla o hay errores se ejecuta el callback de error
exports.autenticar = function(login, password, callback) {
	models.User.find ({
		where: { username: login }
	}).then(function(user) {
    	if (users) {
        	if (users.verifyPassword(password)) {
            	callback(null, users);
        	} else { callback(new Error("Password erróneo.")); }       
    	} else { callback(new Error("No existe el usuario " + login)) }
	}).catch(function(error) { callback(error)});
};