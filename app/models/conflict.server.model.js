'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Conflict Schema
 */
var ConflictSchema = new Schema({
	conflictType: {
		type: String,
		default: '',
		required: 'Please fill Conflict Type',
		trim: true
	},
	proceedingNumber: {
		type: String,
		default: '',
		trim: true
	},
	registrationNumber: {
		type: String,
		default: '',
		trim: true
	},
	mark: {
		type: String,
		default: '',
		trim: true
	},
	petitioner: {
		type: String,
		default: '',
		trim: true
	},
	respondent: {
		type: String,
		default: '',
		trim: true
	},
	opposingCounselName: {
		type: String,
		default: '',
		trim: true
	},
	opposingCounselAddress: {
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

mongoose.model('Conflict', ConflictSchema);
