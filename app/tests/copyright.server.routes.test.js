'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Copyright = mongoose.model('Copyright'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, copyright;

/**
 * Copyright routes tests
 */
describe('Copyright CRUD tests', function() {
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

		// Save a user to the test db and create new Copyright
		user.save(function() {
			copyright = {
				name: 'Copyright Name'
			};

			done();
		});
	});

	it('should be able to save Copyright instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Copyright
				agent.post('/copyrights')
					.send(copyright)
					.expect(200)
					.end(function(copyrightSaveErr, copyrightSaveRes) {
						// Handle Copyright save error
						if (copyrightSaveErr) done(copyrightSaveErr);

						// Get a list of Copyrights
						agent.get('/copyrights')
							.end(function(copyrightsGetErr, copyrightsGetRes) {
								// Handle Copyright save error
								if (copyrightsGetErr) done(copyrightsGetErr);

								// Get Copyrights list
								var copyrights = copyrightsGetRes.body;

								// Set assertions
								(copyrights[0].user._id).should.equal(userId);
								(copyrights[0].name).should.match('Copyright Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Copyright instance if not logged in', function(done) {
		agent.post('/copyrights')
			.send(copyright)
			.expect(401)
			.end(function(copyrightSaveErr, copyrightSaveRes) {
				// Call the assertion callback
				done(copyrightSaveErr);
			});
	});

	it('should not be able to save Copyright instance if no name is provided', function(done) {
		// Invalidate name field
		copyright.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Copyright
				agent.post('/copyrights')
					.send(copyright)
					.expect(400)
					.end(function(copyrightSaveErr, copyrightSaveRes) {
						// Set message assertion
						(copyrightSaveRes.body.message).should.match('Please fill Copyright name');
						
						// Handle Copyright save error
						done(copyrightSaveErr);
					});
			});
	});

	it('should be able to update Copyright instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Copyright
				agent.post('/copyrights')
					.send(copyright)
					.expect(200)
					.end(function(copyrightSaveErr, copyrightSaveRes) {
						// Handle Copyright save error
						if (copyrightSaveErr) done(copyrightSaveErr);

						// Update Copyright name
						copyright.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Copyright
						agent.put('/copyrights/' + copyrightSaveRes.body._id)
							.send(copyright)
							.expect(200)
							.end(function(copyrightUpdateErr, copyrightUpdateRes) {
								// Handle Copyright update error
								if (copyrightUpdateErr) done(copyrightUpdateErr);

								// Set assertions
								(copyrightUpdateRes.body._id).should.equal(copyrightSaveRes.body._id);
								(copyrightUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Copyrights if not signed in', function(done) {
		// Create new Copyright model instance
		var copyrightObj = new Copyright(copyright);

		// Save the Copyright
		copyrightObj.save(function() {
			// Request Copyrights
			request(app).get('/copyrights')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Copyright if not signed in', function(done) {
		// Create new Copyright model instance
		var copyrightObj = new Copyright(copyright);

		// Save the Copyright
		copyrightObj.save(function() {
			request(app).get('/copyrights/' + copyrightObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', copyright.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Copyright instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Copyright
				agent.post('/copyrights')
					.send(copyright)
					.expect(200)
					.end(function(copyrightSaveErr, copyrightSaveRes) {
						// Handle Copyright save error
						if (copyrightSaveErr) done(copyrightSaveErr);

						// Delete existing Copyright
						agent.delete('/copyrights/' + copyrightSaveRes.body._id)
							.send(copyright)
							.expect(200)
							.end(function(copyrightDeleteErr, copyrightDeleteRes) {
								// Handle Copyright error error
								if (copyrightDeleteErr) done(copyrightDeleteErr);

								// Set assertions
								(copyrightDeleteRes.body._id).should.equal(copyrightSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Copyright instance if not signed in', function(done) {
		// Set Copyright user 
		copyright.user = user;

		// Create new Copyright model instance
		var copyrightObj = new Copyright(copyright);

		// Save the Copyright
		copyrightObj.save(function() {
			// Try deleting Copyright
			request(app).delete('/copyrights/' + copyrightObj._id)
			.expect(401)
			.end(function(copyrightDeleteErr, copyrightDeleteRes) {
				// Set message assertion
				(copyrightDeleteRes.body.message).should.match('User is not logged in');

				// Handle Copyright error error
				done(copyrightDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Copyright.remove().exec();
		done();
	});
});