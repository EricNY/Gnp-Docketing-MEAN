'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Copyright = mongoose.model('Copyright'),
	_ = require('lodash');

/**
 * Create a Copyright
 */
exports.create = function(req, res) {
	var copyright = new Copyright(req.body);
	copyright.user = req.user;

	copyright.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(copyright);
		}
	});
};

/**
 * Show the current Copyright
 */
exports.read = function(req, res) {
	res.jsonp(req.copyright);
};

/**
 * Update a Copyright
 */
exports.update = function(req, res) {
	var copyright = req.copyright ;

	copyright = _.extend(copyright , req.body);

	copyright.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(copyright);
		}
	});
};

/**
 * Delete an Copyright
 */
exports.delete = function(req, res) {
	var copyright = req.copyright ;

	copyright.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(copyright);
		}
	});
};

/**
 * List of Copyrights
 */
exports.list = function(req, res) { 
	Copyright.find().sort('-created').populate('user', 'displayName').exec(function(err, copyrights) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(copyrights);
		}
	});
};

/**
 * Copyright middleware
 */
exports.copyrightByID = function(req, res, next, id) { 
	Copyright.findById(id).populate('user', 'displayName').exec(function(err, copyright) {
		if (err) return next(err);
		if (! copyright) return next(new Error('Failed to load Copyright ' + id));
		req.copyright = copyright ;
		next();
	});
};

/**
 * Copyright authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.copyright.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
