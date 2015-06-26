'use strict';

// Copyrights controller
angular.module('copyrights').controller('CopyrightsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Copyrights',
	function($scope, $stateParams, $location, Authentication, Copyrights) {
		$scope.authentication = Authentication;

		// Create new Copyright
		$scope.create = function() {
			// Create new Copyright object
			var copyright = new Copyrights ({
				owner							: this.owner,
				author						: this.author,
				workType					: this.workType,
				workTitle					: this.workTitle,
				publishedDate			: this.publishedDate,
				registrationDate	: this.registrationDate,
				registrationNumber: this.registrationNumber,
				comments					: this.comments
			});
			// Redirect after save
			copyright.$save(function(response) {
				$location.path('copyrights/' + response._id);

				// Clear form fields
				$scope.owner = '';
				$scope.author = '';
				$scope.workType = '';
				$scope.workTitle = '';
				$scope.publishedDate = '';
				$scope.registrationDate = '';
				$scope.registrationNumber = '';
				$scope.comments = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Copyright
		$scope.remove = function(copyright) {
			if ( copyright ) {
				copyright.$remove();

				for (var i in $scope.copyrights) {
					if ($scope.copyrights [i] === copyright) {
						$scope.copyrights.splice(i, 1);
					}
				}
			} else {
				$scope.copyright.$remove(function() {
					$location.path('copyrights');
				});
			}
		};

		// Update existing Copyright
		$scope.update = function() {
			var copyright = $scope.copyright;

			copyright.$update(function() {
				$location.path('copyrights/' + copyright._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Copyrights
		$scope.find = function() {
			$scope.copyrights = Copyrights.query();
		};

		// Find existing Copyright
		$scope.findOne = function() {
			$scope.copyright = Copyrights.get({
				copyrightId: $stateParams.copyrightId
			});
		};

		// direct to show page
		$scope.listItemClick = function(copyrightId) {
			location.href = '#!/copyrights/' + copyrightId;
		};

	}
]);
