'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Patent Schema
 */
var PatentSchema = new Schema({
	owner: {
		type: String,
		default: '',
		required: 'Please fill Patent owner',
		trim: true
	},
	address: {
		type: String,
		default: '',
		trim: true
	},
	nature: {
		type: String,
		default: '',
		trim: true
	},
	country: {
		type: String,
		default: '',
		trim: true
	},
	filingDate: {
		type: Date
	},
	issueDate: {
		type: Date
	},
	applicationNumber: {
		type: String,
		default: '',
		trim: true
	},
	patentNumber: {
		type: String,
		default: '',
		trim: true
	},
	patentStatus: {
		type: String,
		default: '',
		trim: true
	},
	statusDate: {
		type: Date
	},
	dueDate: {
		type: Date
	},
	secondDueDate: {
		type: Date
	},
	thirdDueDate: {
		type: Date
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

mongoose.model('Patent', PatentSchema);
	
