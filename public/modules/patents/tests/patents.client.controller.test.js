'use strict';

(function() {
	// Patents Controller Spec
	describe('Patents Controller Tests', function() {
		// Initialize global variables
		var PatentsController,
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

			// Initialize the Patents controller.
			PatentsController = $controller('PatentsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Patent object fetched from XHR', inject(function(Patents) {
			// Create sample Patent using the Patents service
			var samplePatent = new Patents({
				name: 'New Patent'
			});

			// Create a sample Patents array that includes the new Patent
			var samplePatents = [samplePatent];

			// Set GET response
			$httpBackend.expectGET('patents').respond(samplePatents);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.patents).toEqualData(samplePatents);
		}));

		it('$scope.findOne() should create an array with one Patent object fetched from XHR using a patentId URL parameter', inject(function(Patents) {
			// Define a sample Patent object
			var samplePatent = new Patents({
				name: 'New Patent'
			});

			// Set the URL parameter
			$stateParams.patentId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/patents\/([0-9a-fA-F]{24})$/).respond(samplePatent);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.patent).toEqualData(samplePatent);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Patents) {
			// Create a sample Patent object
			var samplePatentPostData = new Patents({
				name: 'New Patent'
			});

			// Create a sample Patent response
			var samplePatentResponse = new Patents({
				_id: '525cf20451979dea2c000001',
				name: 'New Patent'
			});

			// Fixture mock form input values
			scope.name = 'New Patent';

			// Set POST response
			$httpBackend.expectPOST('patents', samplePatentPostData).respond(samplePatentResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Patent was created
			expect($location.path()).toBe('/patents/' + samplePatentResponse._id);
		}));

		it('$scope.update() should update a valid Patent', inject(function(Patents) {
			// Define a sample Patent put data
			var samplePatentPutData = new Patents({
				_id: '525cf20451979dea2c000001',
				name: 'New Patent'
			});

			// Mock Patent in scope
			scope.patent = samplePatentPutData;

			// Set PUT response
			$httpBackend.expectPUT(/patents\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/patents/' + samplePatentPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid patentId and remove the Patent from the scope', inject(function(Patents) {
			// Create new Patent object
			var samplePatent = new Patents({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Patents array and include the Patent
			scope.patents = [samplePatent];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/patents\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePatent);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.patents.length).toBe(0);
		}));
	});
}());