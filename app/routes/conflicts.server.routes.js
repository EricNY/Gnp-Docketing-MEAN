'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var conflicts = require('../../app/controllers/conflicts.server.controller');

	// Conflicts Routes
	app.route('/conflicts')
		.get(conflicts.list)
		.post(users.requiresLogin, conflicts.create);

	app.route('/conflicts/:conflictId')
		.get(conflicts.read)
		.put(users.requiresLogin, conflicts.hasAuthorization, conflicts.update)
		.delete(users.requiresLogin, conflicts.hasAuthorization, conflicts.delete);

	// Finish by binding the Conflict middleware
	app.param('conflictId', conflicts.conflictByID);
};
