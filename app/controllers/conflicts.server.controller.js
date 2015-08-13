'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Conflict = mongoose.model('Conflict'),
	_ = require('lodash');

/**
 * Create a Conflict
 */
exports.create = function(req, res) {
	var conflict = new Conflict(req.body);
	conflict.user = req.user;

	conflict.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(conflict);
		}
	});
};

/**
 * Show the current Conflict
 */
exports.read = function(req, res) {
	res.jsonp(req.conflict);
};

/**
 * Update a Conflict
 */
exports.update = function(req, res) {
	var conflict = req.conflict ;

	conflict = _.extend(conflict , req.body);

	conflict.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(conflict);
		}
	});
};

/**
 * Delete an Conflict
 */
exports.delete = function(req, res) {
	var conflict = req.conflict ;

	conflict.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(conflict);
		}
	});
};

/**
 * List of Conflicts
 */
exports.list = function(req, res) { 
	Conflict.find().sort('-created').populate('user', 'displayName').exec(function(err, conflicts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(conflicts);
		}
	});
};

/**
 * Conflict middleware
 */
exports.conflictByID = function(req, res, next, id) { 
	Conflict.findById(id).populate('user', 'displayName').exec(function(err, conflict) {
		if (err) return next(err);
		if (! conflict) return next(new Error('Failed to load Conflict ' + id));
		req.conflict = conflict ;
		next();
	});
};

/**
 * Conflict authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.conflict.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
