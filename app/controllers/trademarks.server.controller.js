'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Trademark = mongoose.model('Trademark'),
	_ = require('lodash');

/**
 * Create a Trademark
 */
exports.create = function(req, res) {
	var trademark = new Trademark(req.body);
	trademark.user = req.user;

	trademark.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trademark);
		}
	});
};

/**
 * Show the current Trademark
 */
exports.read = function(req, res) {
	res.jsonp(req.trademark);
};

/**
 * Update a Trademark
 */
exports.update = function(req, res) {
	var trademark = req.trademark ;

	trademark = _.extend(trademark , req.body);

	trademark.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trademark);
		}
	});
};

/**
 * Delete an Trademark
 */
exports.delete = function(req, res) {
	var trademark = req.trademark ;

	trademark.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trademark);
		}
	});
};

/**
 * List of Trademarks
 */
exports.list = function(req, res) { 
	Trademark.find().sort('-created').populate('user', 'displayName').exec(function(err, trademarks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trademarks);
		}
	});
};

/**
 * Trademark middleware
 */
exports.trademarkByID = function(req, res, next, id) { 
	Trademark.findById(id).populate('user', 'displayName').exec(function(err, trademark) {
		if (err) return next(err);
		if (! trademark) return next(new Error('Failed to load Trademark ' + id));
		req.trademark = trademark ;
		next();
	});
};

/**
 * Trademark authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.trademark.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
