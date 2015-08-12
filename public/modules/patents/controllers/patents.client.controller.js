'use strict';

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

		// for search feature
		$scope.sortType     = 'owner';
		$scope.sortReverse  = false;
		$scope.searchPatents   = '';

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

		$scope.getDueDate = function(month, year, day, month_offset, year_offset){
				var dueDateMonth = month + month_offset +1;
				var dueDateYear = year + year_offset;
				var dueDateDay = day + 1;

				if (dueDateMonth > 12) {
					dueDateMonth = dueDateMonth % 12;
					dueDateYear = dueDateYear + 1;
				}
				if (dueDateMonth < 10) {
					dueDateMonth = dueDateMonth.toString();
					dueDateMonth = '0' + dueDateMonth;
				}
				if (dueDateDay < 10) {
					dueDateDay = dueDateDay.toString();
					dueDateDay = '0' + dueDateDay;
				}
				dueDateYear = dueDateYear.toString();
				dueDateMonth = dueDateMonth.toString();
				dueDateDay = dueDateDay.toString();

				return dueDateYear + '-' + dueDateMonth + '-' + dueDateDay;
		};

		// once a statusDate is selected the due dates are 
		// automatically calculated depending on what status is selected
		$scope.calculateDueDates = function (selectedOption, toggle) {
			var that = this;
			var month, year, day;

			if (toggle === 'edit') {
				that = this.patent;
			}

			month = that.statusDate.getUTCMonth();
			year = that.statusDate.getUTCFullYear();
			day = that.statusDate.getUTCDate();

			switch(selectedOption) {
				case 0: // Provisional - 1 year
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 0, 1) ).toISOString();
					break;
				case 1: // notice to file missing parts - 2 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 2, 0) );
					break;
				case 2: // Restriction Requirement - 2 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 2, 0) );
					break;
				case 3: // office action - 3 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 3, 0) );
					break;
				case 4: // Extension 1 - 1 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 1, 0) );
					break;
				case 5: // Extension 2 - 1 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 1, 0) );
					break;
				case 6: // Extension 3 - 1 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 1, 0) );
					break;
				case 7: // NOA - 3 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 3, 0) );
					break;
				case 8: // issued - 3yr --> 7yr --> 11yr
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 0, 3) );
					that.secondDueDate = new Date( $scope.getDueDate(month, year, day, 0, 7) );
					that.thirdDueDate = new Date( $scope.getDueDate(month, year, day, 0, 11) ).toISOString();
					break;
				case 9: // Design - 14 yrs
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 0, 14) );
					break;
				default: // Utility - 20 yrs
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 0, 20) );
			}
		};
	}
]);
