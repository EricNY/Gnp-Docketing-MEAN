'use strict';

(function() {
	// Copyrights Controller Spec
	describe('Copyrights Controller Tests', function() {
		// Initialize global variables
		var CopyrightsController,
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

			// Initialize the Copyrights controller.
			CopyrightsController = $controller('CopyrightsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Copyright object fetched from XHR', inject(function(Copyrights) {
			// Create sample Copyright using the Copyrights service
			var sampleCopyright = new Copyrights({
				name: 'New Copyright'
			});

			// Create a sample Copyrights array that includes the new Copyright
			var sampleCopyrights = [sampleCopyright];

			// Set GET response
			$httpBackend.expectGET('copyrights').respond(sampleCopyrights);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.copyrights).toEqualData(sampleCopyrights);
		}));

		it('$scope.findOne() should create an array with one Copyright object fetched from XHR using a copyrightId URL parameter', inject(function(Copyrights) {
			// Define a sample Copyright object
			var sampleCopyright = new Copyrights({
				name: 'New Copyright'
			});

			// Set the URL parameter
			$stateParams.copyrightId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/copyrights\/([0-9a-fA-F]{24})$/).respond(sampleCopyright);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.copyright).toEqualData(sampleCopyright);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Copyrights) {
			// Create a sample Copyright object
			var sampleCopyrightPostData = new Copyrights({
				name: 'New Copyright'
			});

			// Create a sample Copyright response
			var sampleCopyrightResponse = new Copyrights({
				_id: '525cf20451979dea2c000001',
				name: 'New Copyright'
			});

			// Fixture mock form input values
			scope.name = 'New Copyright';

			// Set POST response
			$httpBackend.expectPOST('copyrights', sampleCopyrightPostData).respond(sampleCopyrightResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Copyright was created
			expect($location.path()).toBe('/copyrights/' + sampleCopyrightResponse._id);
		}));

		it('$scope.update() should update a valid Copyright', inject(function(Copyrights) {
			// Define a sample Copyright put data
			var sampleCopyrightPutData = new Copyrights({
				_id: '525cf20451979dea2c000001',
				name: 'New Copyright'
			});

			// Mock Copyright in scope
			scope.copyright = sampleCopyrightPutData;

			// Set PUT response
			$httpBackend.expectPUT(/copyrights\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/copyrights/' + sampleCopyrightPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid copyrightId and remove the Copyright from the scope', inject(function(Copyrights) {
			// Create new Copyright object
			var sampleCopyright = new Copyrights({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Copyrights array and include the Copyright
			scope.copyrights = [sampleCopyright];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/copyrights\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCopyright);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.copyrights.length).toBe(0);
		}));
	});
}());