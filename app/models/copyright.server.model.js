'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Copyright Schema
 */
var CopyrightSchema = new Schema({
	owner: {
		type: String,
		default: '',
		required: 'Please fill Copyright owner',
		trim: true
	},
	address: {
		type: String,
		default: '',
		trim: true
	},
	author: {
		type: String,
		default: '',
		trim: true
	},
	workType: {
		type: String,
		default: '',
		trim: true
	},
	workTitle: {
		type: String,
		default: '',
		trim: true
	},
	publishedDate: {
		type: Date
	},
	registrationDate: {
		type: Date
	},
	registrationNumber: {
		type: String,
		default: '',
		trim: true
	},
	comments: {
		type: String,
		default: '',
		trim: true
	},
	attorney: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Copyright', CopyrightSchema);
