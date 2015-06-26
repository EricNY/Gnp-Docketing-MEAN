'use strict';

(function() {
	// Trademarks Controller Spec
	describe('Trademarks Controller Tests', function() {
		// Initialize global variables
		var TrademarksController,
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

			// Initialize the Trademarks controller.
			TrademarksController = $controller('TrademarksController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Trademark object fetched from XHR', inject(function(Trademarks) {
			// Create sample Trademark using the Trademarks service
			var sampleTrademark = new Trademarks({
				name: 'New Trademark'
			});

			// Create a sample Trademarks array that includes the new Trademark
			var sampleTrademarks = [sampleTrademark];

			// Set GET response
			$httpBackend.expectGET('trademarks').respond(sampleTrademarks);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.trademarks).toEqualData(sampleTrademarks);
		}));

		it('$scope.findOne() should create an array with one Trademark object fetched from XHR using a trademarkId URL parameter', inject(function(Trademarks) {
			// Define a sample Trademark object
			var sampleTrademark = new Trademarks({
				name: 'New Trademark'
			});

			// Set the URL parameter
			$stateParams.trademarkId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/trademarks\/([0-9a-fA-F]{24})$/).respond(sampleTrademark);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.trademark).toEqualData(sampleTrademark);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Trademarks) {
			// Create a sample Trademark object
			var sampleTrademarkPostData = new Trademarks({
				name: 'New Trademark'
			});

			// Create a sample Trademark response
			var sampleTrademarkResponse = new Trademarks({
				_id: '525cf20451979dea2c000001',
				name: 'New Trademark'
			});

			// Fixture mock form input values
			scope.name = 'New Trademark';

			// Set POST response
			$httpBackend.expectPOST('trademarks', sampleTrademarkPostData).respond(sampleTrademarkResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Trademark was created
			expect($location.path()).toBe('/trademarks/' + sampleTrademarkResponse._id);
		}));

		it('$scope.update() should update a valid Trademark', inject(function(Trademarks) {
			// Define a sample Trademark put data
			var sampleTrademarkPutData = new Trademarks({
				_id: '525cf20451979dea2c000001',
				name: 'New Trademark'
			});

			// Mock Trademark in scope
			scope.trademark = sampleTrademarkPutData;

			// Set PUT response
			$httpBackend.expectPUT(/trademarks\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/trademarks/' + sampleTrademarkPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid trademarkId and remove the Trademark from the scope', inject(function(Trademarks) {
			// Create new Trademark object
			var sampleTrademark = new Trademarks({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Trademarks array and include the Trademark
			scope.trademarks = [sampleTrademark];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/trademarks\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTrademark);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.trademarks.length).toBe(0);
		}));
	});
}());