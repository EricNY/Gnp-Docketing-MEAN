'use strict';

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

/**
 * send a test email.
 */
exports.sendMail = function(req, res) {

	var data = req.body;

	transporter.sendMail({
		from: 'info@gandplaw.com',
		to: data.contactEmail,
		subject: 'hello',
		text: data.contactName
	});

	res.json(data.contactName);

};
