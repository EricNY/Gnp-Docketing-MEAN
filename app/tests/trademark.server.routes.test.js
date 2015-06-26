'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Trademark = mongoose.model('Trademark'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, trademark;

/**
 * Trademark routes tests
 */
describe('Trademark CRUD tests', function() {
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

		// Save a user to the test db and create new Trademark
		user.save(function() {
			trademark = {
				name: 'Trademark Name'
			};

			done();
		});
	});

	it('should be able to save Trademark instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Trademark
				agent.post('/trademarks')
					.send(trademark)
					.expect(200)
					.end(function(trademarkSaveErr, trademarkSaveRes) {
						// Handle Trademark save error
						if (trademarkSaveErr) done(trademarkSaveErr);

						// Get a list of Trademarks
						agent.get('/trademarks')
							.end(function(trademarksGetErr, trademarksGetRes) {
								// Handle Trademark save error
								if (trademarksGetErr) done(trademarksGetErr);

								// Get Trademarks list
								var trademarks = trademarksGetRes.body;

								// Set assertions
								(trademarks[0].user._id).should.equal(userId);
								(trademarks[0].name).should.match('Trademark Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Trademark instance if not logged in', function(done) {
		agent.post('/trademarks')
			.send(trademark)
			.expect(401)
			.end(function(trademarkSaveErr, trademarkSaveRes) {
				// Call the assertion callback
				done(trademarkSaveErr);
			});
	});

	it('should not be able to save Trademark instance if no name is provided', function(done) {
		// Invalidate name field
		trademark.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Trademark
				agent.post('/trademarks')
					.send(trademark)
					.expect(400)
					.end(function(trademarkSaveErr, trademarkSaveRes) {
						// Set message assertion
						(trademarkSaveRes.body.message).should.match('Please fill Trademark name');
						
						// Handle Trademark save error
						done(trademarkSaveErr);
					});
			});
	});

	it('should be able to update Trademark instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Trademark
				agent.post('/trademarks')
					.send(trademark)
					.expect(200)
					.end(function(trademarkSaveErr, trademarkSaveRes) {
						// Handle Trademark save error
						if (trademarkSaveErr) done(trademarkSaveErr);

						// Update Trademark name
						trademark.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Trademark
						agent.put('/trademarks/' + trademarkSaveRes.body._id)
							.send(trademark)
							.expect(200)
							.end(function(trademarkUpdateErr, trademarkUpdateRes) {
								// Handle Trademark update error
								if (trademarkUpdateErr) done(trademarkUpdateErr);

								// Set assertions
								(trademarkUpdateRes.body._id).should.equal(trademarkSaveRes.body._id);
								(trademarkUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Trademarks if not signed in', function(done) {
		// Create new Trademark model instance
		var trademarkObj = new Trademark(trademark);

		// Save the Trademark
		trademarkObj.save(function() {
			// Request Trademarks
			request(app).get('/trademarks')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Trademark if not signed in', function(done) {
		// Create new Trademark model instance
		var trademarkObj = new Trademark(trademark);

		// Save the Trademark
		trademarkObj.save(function() {
			request(app).get('/trademarks/' + trademarkObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', trademark.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Trademark instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Trademark
				agent.post('/trademarks')
					.send(trademark)
					.expect(200)
					.end(function(trademarkSaveErr, trademarkSaveRes) {
						// Handle Trademark save error
						if (trademarkSaveErr) done(trademarkSaveErr);

						// Delete existing Trademark
						agent.delete('/trademarks/' + trademarkSaveRes.body._id)
							.send(trademark)
							.expect(200)
							.end(function(trademarkDeleteErr, trademarkDeleteRes) {
								// Handle Trademark error error
								if (trademarkDeleteErr) done(trademarkDeleteErr);

								// Set assertions
								(trademarkDeleteRes.body._id).should.equal(trademarkSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Trademark instance if not signed in', function(done) {
		// Set Trademark user 
		trademark.user = user;

		// Create new Trademark model instance
		var trademarkObj = new Trademark(trademark);

		// Save the Trademark
		trademarkObj.save(function() {
			// Try deleting Trademark
			request(app).delete('/trademarks/' + trademarkObj._id)
			.expect(401)
			.end(function(trademarkDeleteErr, trademarkDeleteRes) {
				// Set message assertion
				(trademarkDeleteRes.body.message).should.match('User is not logged in');

				// Handle Trademark error error
				done(trademarkDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Trademark.remove().exec();
		done();
	});
});