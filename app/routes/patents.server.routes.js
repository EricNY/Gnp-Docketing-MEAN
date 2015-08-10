'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	patents = require('../../app/controllers/patents.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/patents')
		.get(patents.list)
		.post(users.requiresLogin, patents.create);

	app.route('/patents/:patentId')
		.get(patents.read)
		.put(users.requiresLogin, patents.hasAuthorization, patents.update)
		.delete(users.requiresLogin, patents.hasAuthorization, patents.delete);

	// Finish by binding the article middleware
	app.param('patentId', patents.patentByID);
};


