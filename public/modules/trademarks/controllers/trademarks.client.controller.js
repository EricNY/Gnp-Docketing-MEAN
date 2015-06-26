'use strict';

// Trademarks controller
angular.module('trademarks').controller('TrademarksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Trademarks',
	function($scope, $stateParams, $location, Authentication, Trademarks) {
		$scope.authentication = Authentication;

		// Create new Trademark
		$scope.create = function() {
			// Create new Trademark object
			var trademark = new Trademarks ({
				owner							: this.owner,
				mark							: this.mark,
				country						: this.country,
				ic								: this.ic,
				goodsAndServices	: this.goodsAndServices,
				filingDate				: this.filingDate,
				registrationDate	: this.registrationDate,
				applicationNumber	: this.applicationNumber,
				registrationNumber: this.registrationNumber,
				trademarkStatus		: this.trademarkStatus,
				statusDate				: this.statusDate,
				dueDate						: this.dueDate,
				secondDueDate			: this.secondDueDate,
				comments					: this.comments
			});

			// Redirect after save
			trademark.$save(function(response) {
				$location.path('trademarks/' + response._id);

				// Clear form fields
				$scope.owner = '';
				$scope.mark = '';
				$scope.country = '';
				$scope.ic = '';
				$scope.goodsAndServices = '';
				$scope.filingDate = '';
				$scope.registrationDate = '';
				$scope.applicationNumber = '';
				$scope.registrationNumber = '';
				$scope.trademarkStatus = '';
				$scope.statusDate = '';
				$scope.dueDate = '';
				$scope.secondDueDate = '';
				$scope.comments = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Trademark
		$scope.remove = function(trademark) {
			if ( trademark ) {
				trademark.$remove();

				for (var i in $scope.trademarks) {
					if ($scope.trademarks [i] === trademark) {
						$scope.trademarks.splice(i, 1);
					}
				}
			} else {
				$scope.trademark.$remove(function() {
					$location.path('trademarks');
				});
			}
		};

		// Update existing Trademark
		$scope.update = function() {
			var trademark = $scope.trademark;

			trademark.$update(function() {
				$location.path('trademarks/' + trademark._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Trademarks
		$scope.find = function() {
			$scope.trademarks = Trademarks.query();
		};

		// Find existing Trademark
		$scope.findOne = function() {
			$scope.trademark = Trademarks.get({
				trademarkId: $stateParams.trademarkId
			});
		};

		// direct to show page
		$scope.listItemClick = function(trademarkId) {
			location.href = '#!/trademarks/' + trademarkId;
		};
	}
]);
