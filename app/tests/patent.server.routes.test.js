'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Patent = mongoose.model('Patent'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, patent;

/**
 * Patent routes tests
 */
describe('Patent CRUD tests', function() {
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

		// Save a user to the test db and create new Patent
		user.save(function() {
			patent = {
				name: 'Patent Name'
			};

			done();
		});
	});

	it('should be able to save Patent instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Patent
				agent.post('/patents')
					.send(patent)
					.expect(200)
					.end(function(patentSaveErr, patentSaveRes) {
						// Handle Patent save error
						if (patentSaveErr) done(patentSaveErr);

						// Get a list of Patents
						agent.get('/patents')
							.end(function(patentsGetErr, patentsGetRes) {
								// Handle Patent save error
								if (patentsGetErr) done(patentsGetErr);

								// Get Patents list
								var patents = patentsGetRes.body;

								// Set assertions
								(patents[0].user._id).should.equal(userId);
								(patents[0].name).should.match('Patent Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Patent instance if not logged in', function(done) {
		agent.post('/patents')
			.send(patent)
			.expect(401)
			.end(function(patentSaveErr, patentSaveRes) {
				// Call the assertion callback
				done(patentSaveErr);
			});
	});

	it('should not be able to save Patent instance if no name is provided', function(done) {
		// Invalidate name field
		patent.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Patent
				agent.post('/patents')
					.send(patent)
					.expect(400)
					.end(function(patentSaveErr, patentSaveRes) {
						// Set message assertion
						(patentSaveRes.body.message).should.match('Please fill Patent name');
						
						// Handle Patent save error
						done(patentSaveErr);
					});
			});
	});

	it('should be able to update Patent instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Patent
				agent.post('/patents')
					.send(patent)
					.expect(200)
					.end(function(patentSaveErr, patentSaveRes) {
						// Handle Patent save error
						if (patentSaveErr) done(patentSaveErr);

						// Update Patent name
						patent.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Patent
						agent.put('/patents/' + patentSaveRes.body._id)
							.send(patent)
							.expect(200)
							.end(function(patentUpdateErr, patentUpdateRes) {
								// Handle Patent update error
								if (patentUpdateErr) done(patentUpdateErr);

								// Set assertions
								(patentUpdateRes.body._id).should.equal(patentSaveRes.body._id);
								(patentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Patents if not signed in', function(done) {
		// Create new Patent model instance
		var patentObj = new Patent(patent);

		// Save the Patent
		patentObj.save(function() {
			// Request Patents
			request(app).get('/patents')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Patent if not signed in', function(done) {
		// Create new Patent model instance
		var patentObj = new Patent(patent);

		// Save the Patent
		patentObj.save(function() {
			request(app).get('/patents/' + patentObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', patent.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Patent instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Patent
				agent.post('/patents')
					.send(patent)
					.expect(200)
					.end(function(patentSaveErr, patentSaveRes) {
						// Handle Patent save error
						if (patentSaveErr) done(patentSaveErr);

						// Delete existing Patent
						agent.delete('/patents/' + patentSaveRes.body._id)
							.send(patent)
							.expect(200)
							.end(function(patentDeleteErr, patentDeleteRes) {
								// Handle Patent error error
								if (patentDeleteErr) done(patentDeleteErr);

								// Set assertions
								(patentDeleteRes.body._id).should.equal(patentSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Patent instance if not signed in', function(done) {
		// Set Patent user 
		patent.user = user;

		// Create new Patent model instance
		var patentObj = new Patent(patent);

		// Save the Patent
		patentObj.save(function() {
			// Try deleting Patent
			request(app).delete('/patents/' + patentObj._id)
			.expect(401)
			.end(function(patentDeleteErr, patentDeleteRes) {
				// Set message assertion
				(patentDeleteRes.body.message).should.match('User is not logged in');

				// Handle Patent error error
				done(patentDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Patent.remove().exec();
		done();
	});
});