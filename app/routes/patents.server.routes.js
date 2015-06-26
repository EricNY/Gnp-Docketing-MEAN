'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var patents = require('../../app/controllers/patents.server.controller');

	// Patents Routes
	app.route('/patents')
		.get(patents.list)
		.post(users.requiresLogin, patents.create);

	app.route('/patents/:patentId')
		.get(patents.read)
		.put(users.requiresLogin, patents.hasAuthorization, patents.update)
		.delete(users.requiresLogin, patents.hasAuthorization, patents.delete);

	// Finish by binding the Patent middleware
	app.param('patentId', patents.patentByID);
};
