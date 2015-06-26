'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Patent = mongoose.model('Patent'),
	_ = require('lodash');

/**
 * Create a Patent
 */
exports.create = function(req, res) {
	var patent = new Patent(req.body);
	patent.user = req.user;

	patent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patent);
		}
	});
};

/**
 * Show the current Patent
 */
exports.read = function(req, res) {
	res.jsonp(req.patent);
};

/**
 * Update a Patent
 */
exports.update = function(req, res) {
	var patent = req.patent ;

	patent = _.extend(patent , req.body);

	patent.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patent);
		}
	});
};

/**
 * Delete an Patent
 */
exports.delete = function(req, res) {
	var patent = req.patent ;

	patent.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patent);
		}
	});
};

/**
 * List of Patents
 */
exports.list = function(req, res) {
	Patent.find().sort('-created').populate('user', 'displayName').exec(function(err, patents) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patents);
		}
	});
};

/**
 * Patent middleware
 */
exports.patentByID = function(req, res, next, id) {
	Patent.findById(id).populate('user', 'displayName').exec(function(err, patent) {
		if (err) return next(err);
		if (! patent) return next(new Error('Failed to load Patent ' + id));
		req.patent = patent ;
		next();
	});
};

/**
 * Patent authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.patent.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
