'use strict';

(function() {
	// Conflicts Controller Spec
	describe('Conflicts Controller Tests', function() {
		// Initialize global variables
		var ConflictsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Conflicts controller.
			ConflictsController = $controller('ConflictsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Conflict object fetched from XHR', inject(function(Conflicts) {
			// Create sample Conflict using the Conflicts service
			var sampleConflict = new Conflicts({
				name: 'New Conflict'
			});

			// Create a sample Conflicts array that includes the new Conflict
			var sampleConflicts = [sampleConflict];

			// Set GET response
			$httpBackend.expectGET('conflicts').respond(sampleConflicts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.conflicts).toEqualData(sampleConflicts);
		}));

		it('$scope.findOne() should create an array with one Conflict object fetched from XHR using a conflictId URL parameter', inject(function(Conflicts) {
			// Define a sample Conflict object
			var sampleConflict = new Conflicts({
				name: 'New Conflict'
			});

			// Set the URL parameter
			$stateParams.conflictId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/conflicts\/([0-9a-fA-F]{24})$/).respond(sampleConflict);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.conflict).toEqualData(sampleConflict);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Conflicts) {
			// Create a sample Conflict object
			var sampleConflictPostData = new Conflicts({
				name: 'New Conflict'
			});

			// Create a sample Conflict response
			var sampleConflictResponse = new Conflicts({
				_id: '525cf20451979dea2c000001',
				name: 'New Conflict'
			});

			// Fixture mock form input values
			scope.name = 'New Conflict';

			// Set POST response
			$httpBackend.expectPOST('conflicts', sampleConflictPostData).respond(sampleConflictResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Conflict was created
			expect($location.path()).toBe('/conflicts/' + sampleConflictResponse._id);
		}));

		it('$scope.update() should update a valid Conflict', inject(function(Conflicts) {
			// Define a sample Conflict put data
			var sampleConflictPutData = new Conflicts({
				_id: '525cf20451979dea2c000001',
				name: 'New Conflict'
			});

			// Mock Conflict in scope
			scope.conflict = sampleConflictPutData;

			// Set PUT response
			$httpBackend.expectPUT(/conflicts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/conflicts/' + sampleConflictPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid conflictId and remove the Conflict from the scope', inject(function(Conflicts) {
			// Create new Conflict object
			var sampleConflict = new Conflicts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Conflicts array and include the Conflict
			scope.conflicts = [sampleConflict];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/conflicts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleConflict);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.conflicts.length).toBe(0);
		}));
	});
}());