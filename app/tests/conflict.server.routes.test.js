'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Conflict = mongoose.model('Conflict'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, conflict;

/**
 * Conflict routes tests
 */
describe('Conflict CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Conflict
		user.save(function() {
			conflict = {
				name: 'Conflict Name'
			};

			done();
		});
	});

	it('should be able to save Conflict instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Conflict
				agent.post('/conflicts')
					.send(conflict)
					.expect(200)
					.end(function(conflictSaveErr, conflictSaveRes) {
						// Handle Conflict save error
						if (conflictSaveErr) done(conflictSaveErr);

						// Get a list of Conflicts
						agent.get('/conflicts')
							.end(function(conflictsGetErr, conflictsGetRes) {
								// Handle Conflict save error
								if (conflictsGetErr) done(conflictsGetErr);

								// Get Conflicts list
								var conflicts = conflictsGetRes.body;

								// Set assertions
								(conflicts[0].user._id).should.equal(userId);
								(conflicts[0].name).should.match('Conflict Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Conflict instance if not logged in', function(done) {
		agent.post('/conflicts')
			.send(conflict)
			.expect(401)
			.end(function(conflictSaveErr, conflictSaveRes) {
				// Call the assertion callback
				done(conflictSaveErr);
			});
	});

	it('should not be able to save Conflict instance if no name is provided', function(done) {
		// Invalidate name field
		conflict.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Conflict
				agent.post('/conflicts')
					.send(conflict)
					.expect(400)
					.end(function(conflictSaveErr, conflictSaveRes) {
						// Set message assertion
						(conflictSaveRes.body.message).should.match('Please fill Conflict name');
						
						// Handle Conflict save error
						done(conflictSaveErr);
					});
			});
	});

	it('should be able to update Conflict instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Conflict
				agent.post('/conflicts')
					.send(conflict)
					.expect(200)
					.end(function(conflictSaveErr, conflictSaveRes) {
						// Handle Conflict save error
						if (conflictSaveErr) done(conflictSaveErr);

						// Update Conflict name
						conflict.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Conflict
						agent.put('/conflicts/' + conflictSaveRes.body._id)
							.send(conflict)
							.expect(200)
							.end(function(conflictUpdateErr, conflictUpdateRes) {
								// Handle Conflict update error
								if (conflictUpdateErr) done(conflictUpdateErr);

								// Set assertions
								(conflictUpdateRes.body._id).should.equal(conflictSaveRes.body._id);
								(conflictUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Conflicts if not signed in', function(done) {
		// Create new Conflict model instance
		var conflictObj = new Conflict(conflict);

		// Save the Conflict
		conflictObj.save(function() {
			// Request Conflicts
			request(app).get('/conflicts')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Conflict if not signed in', function(done) {
		// Create new Conflict model instance
		var conflictObj = new Conflict(conflict);

		// Save the Conflict
		conflictObj.save(function() {
			request(app).get('/conflicts/' + conflictObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', conflict.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Conflict instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Conflict
				agent.post('/conflicts')
					.send(conflict)
					.expect(200)
					.end(function(conflictSaveErr, conflictSaveRes) {
						// Handle Conflict save error
						if (conflictSaveErr) done(conflictSaveErr);

						// Delete existing Conflict
						agent.delete('/conflicts/' + conflictSaveRes.body._id)
							.send(conflict)
							.expect(200)
							.end(function(conflictDeleteErr, conflictDeleteRes) {
								// Handle Conflict error error
								if (conflictDeleteErr) done(conflictDeleteErr);

								// Set assertions
								(conflictDeleteRes.body._id).should.equal(conflictSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Conflict instance if not signed in', function(done) {
		// Set Conflict user 
		conflict.user = user;

		// Create new Conflict model instance
		var conflictObj = new Conflict(conflict);

		// Save the Conflict
		conflictObj.save(function() {
			// Try deleting Conflict
			request(app).delete('/conflicts/' + conflictObj._id)
			.expect(401)
			.end(function(conflictDeleteErr, conflictDeleteRes) {
				// Set message assertion
				(conflictDeleteRes.body.message).should.match('User is not logged in');

				// Handle Conflict error error
				done(conflictDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Conflict.remove().exec();
		done();
	});
});