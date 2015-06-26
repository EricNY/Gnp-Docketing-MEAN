'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var copyrights = require('../../app/controllers/copyrights.server.controller');

	// Copyrights Routes
	app.route('/copyrights')
		.get(copyrights.list)
		.post(users.requiresLogin, copyrights.create);

	app.route('/copyrights/:copyrightId')
		.get(copyrights.read)
		.put(users.requiresLogin, copyrights.hasAuthorization, copyrights.update)
		.delete(users.requiresLogin, copyrights.hasAuthorization, copyrights.delete);

	// Finish by binding the Copyright middleware
	app.param('copyrightId', copyrights.copyrightByID);
};
