'use strict';

// ###################################
// Good idea to split this into separate controllers?

// Patents controller
angular.module('patents').controller('PatentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Patents',
	function($scope, $stateParams, $location, Authentication, Patents) {
		$scope.authentication = Authentication;

		$scope.statusOptions = [
			{id:0, name:'Provisional Application'},
			{id:1, name:'Notice to File Missing Parts'},
			{id:2, name:'Restriction Requirement'},
			{id:3, name:'Office Action'},
			{id:4, name:'Extension 1'},
			{id:5, name:'Extension 2'},
			{id:6, name:'Extension 3'},
			{id:7, name:'NOA'},
			{id:8, name:'Issued'},
			{id:9, name:'Design Patent'},
			{id:10, name:'Utility Patent'}
		];

		// Create new Patent
		$scope.create = function() {
			// Create new Patent object
			var patent = new Patents ({
				owner							: this.owner,
				nature						: this.nature,
				country						: this.country,
				filingDate				: this.filingDate,
				issueDate					: this.issueDate,
				applicationNumber	: this.applicationNumber,
				patentNumber			: this.patentNumber,
				patentStatus			: this.patentStatus,
				statusDate				: this.statusDate,
				dueDate						: this.dueDate,
				secondDueDate			: this.secondDueDate,
				thirdDueDate			: this.thirdDueDate,
				comments					: this.comments
			});

			// Redirect after save
			patent.$save(function(response) {
				$location.path('patents/' + response._id);

				// Clear form fields
				$scope.owner = '';
				$scope.nature = '';
				$scope.country = '';
				$scope.filingDate = '';
				$scope.issueDate = '';
				$scope.applicationNumber = '';
				$scope.patentNumber = '';
				$scope.patentStatus = '';
				$scope.statusDate = '';
				$scope.dueDate = '';
				$scope.secondDueDate = '';
				$scope.thirdDueDate = '';
				$scope.comments = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Patent
		$scope.remove = function(patent) {
			if ( patent ) {
				patent.$remove();

				for (var i in $scope.patents) {
					if ($scope.patents [i] === patent) {
						$scope.patents.splice(i, 1);
					}
				}
			} else {
				$scope.patent.$remove(function() {
					$location.path('patents');
				});
			}
		};

		// Update existing Patent
		$scope.update = function() {

			var patent = $scope.patent;

			patent.$update(function() {
				$location.path('patents/' + patent._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Patents
		$scope.find = function() {
			$scope.patents = Patents.query();
		};

		// Find existing Patent
		$scope.findOne = function() {
			$scope.patent = Patents.get({
				patentId: $stateParams.patentId
			});
		};

		// direct to show page
		$scope.listItemClick = function(patentId) {
			location.href = '#!/patents/' + patentId;
		};

	}
]);
