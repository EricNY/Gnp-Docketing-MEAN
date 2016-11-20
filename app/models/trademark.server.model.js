'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Trademark Schema
 */
var TrademarkSchema = new Schema({
	owner: {
		type: String,
		default: '',
		required: 'Please fill Trademark owner',
		trim: true
	},
	address: {
		type: String,
		default: '',
		trim: true
	},
	mark: {
		type: String,
		default: '',
		trim: true
	},
	country: {
		type: String,
		default: '',
		trim: true
	},
	ic: {
		type: String,
		default: '',
		trim: true
	},
	goodsAndServices: {
		type: String,
		default: '',
		trim: true
	},
	filingDate: {
		type: Date
	},
	registrationDate: {
		type: Date
	},
	applicationNumber: {
		type: String,
		default: '',
		trim: true
	},
	registrationNumber: {
		type: String,
		default: '',
		trim: true
	},
	trademarkStatus: {
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

mongoose.model('Trademark', TrademarkSchema);
