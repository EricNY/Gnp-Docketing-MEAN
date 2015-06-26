'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var trademarks = require('../../app/controllers/trademarks.server.controller');

	// Trademarks Routes
	app.route('/trademarks')
		.get(trademarks.list)
		.post(users.requiresLogin, trademarks.create);

	app.route('/trademarks/:trademarkId')
		.get(trademarks.read)
		.put(users.requiresLogin, trademarks.hasAuthorization, trademarks.update)
		.delete(users.requiresLogin, trademarks.hasAuthorization, trademarks.delete);

	// Finish by binding the Trademark middleware
	app.param('trademarkId', trademarks.trademarkByID);
};
