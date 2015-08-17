'use strict';

// Conflicts controller
angular.module('conflicts').controller('ConflictsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Conflicts',
	function($scope, $stateParams, $location, Authentication, Conflicts) {
		$scope.authentication = Authentication;

		$scope.conflictTypeOptions = [
			{id:0, name:'Opposition'},
			{id:1, name:'Cancellation'},
			{id:2, name:'Ex Parte'}
		];

		// for search feature
		$scope.sortType     = 'conflictType';
		$scope.sortReverse  = false;
		$scope.searchConflicts = '';

		// Create new Conflict
		$scope.create = function() {
			// Create new Conflict object
			var conflict = new Conflicts ({
				conflictType					: this.conflictType,
				proceedingNumber			: this.proceedingNumber,
				registrationNumber		: this.registrationNumber,
				mark									: this.mark,
				petitioner						: this.petitioner,
				respondent						: this.respondent,
				opposingCounselName		: this.opposingCounselName,
				opposingCounselAddress: this.opposingCounselAddress,
			});

			// Redirect after save
			conflict.$save(function(response) {
				$location.path('conflicts/' + response._id);

				// Clear form fields
				$scope.conflictType = '';
				$scope.proceedingNumber = '';
				$scope.registrationNumber = '';
				$scope.mark = '';
				$scope.petitioner = '';
				$scope.respondent = '';
				$scope.opposingCounselName = '';
				$scope.opposingCounselAddress = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Conflict
		$scope.remove = function(conflict) {
			if ( conflict ) {
				conflict.$remove();

				for (var i in $scope.conflicts) {
					if ($scope.conflicts [i] === conflict) {
						$scope.conflicts.splice(i, 1);
					}
				}
			} else {
				$scope.conflict.$remove(function() {
					$location.path('conflicts');
				});
			}
		};

		// Update existing Conflict
		$scope.update = function() {
			var conflict = $scope.conflict;

			conflict.$update(function() {
				$location.path('conflicts/' + conflict._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Conflicts
		$scope.find = function() {
			$scope.conflicts = Conflicts.query();
		};

		// Find existing Conflict
		$scope.findOne = function() {
			$scope.conflict = Conflicts.get({
				conflictId: $stateParams.conflictId
			});
		};

		// direct to show page
    $scope.listItemClick = function(conflictId) {
      location.href = '#!/conflicts/' + conflictId;
    };

	}
]);
