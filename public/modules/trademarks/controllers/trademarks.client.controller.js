'use strict';

// Trademarks controller
angular.module('trademarks').controller('TrademarksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Trademarks',
	function($scope, $stateParams, $location, Authentication, Trademarks) {
		$scope.authentication = Authentication;

		$scope.statusOptions = [
			{id:0, name:'Pending'},
			{id:1, name:'Published'},
			{id:2, name:'NOA'},
			{id:3, name:'Notice of Abandonment'},
			{id:4, name:'Office Action'},
			{id:5, name:'Extension 1'},
			{id:6, name:'Extension 2'},
			{id:7, name:'Extension 3'},
			{id:8, name:'Extension 4'},
			{id:9, name:'Extension 5'},
			{id:10, name:'Registration Date'}
		];

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

		$scope.getDueDate = function(month, year, day, month_offset, year_offset){
			var dueDateMonth = month + month_offset;
			var dueDateYear = year + year_offset;

			if (dueDateMonth > 12) {
				dueDateMonth = dueDateMonth % 12;
				dueDateYear = dueDateYear + 1;
			}
			if (dueDateMonth < 10) {
				dueDateMonth = dueDateMonth.toString();
				dueDateMonth = '0' + dueDateMonth;
			}
			if (day < 10) {
				day = day.toString();
				day = '0' + day;
			}
			dueDateYear = dueDateYear.toString();
			dueDateMonth = dueDateMonth.toString();
			day = day.toString();

			return dueDateYear + '-' + dueDateMonth + '-' + day;
		};

		// once a statusDate is selected the due dates are 
		// automatically calculated depending on what status is selected
		$scope.calculateDueDates = function ( selectedOption ) {
			console.log(selectedOption);

			var dateParts = this.statusDate.match(/(\d{4})\-(\d{2})\-(\d{2})/);
			var month = +dateParts[2];
			var year = +dateParts[1];
			var day = +dateParts[3];

			switch( selectedOption ) {
				case 0: // Pending - 6 mo
					this.dueDate = $scope.getDueDate(month, year, day, 6, 0);
					break;
				case 1: // Published - 6 mo
					this.dueDate = $scope.getDueDate(month, year, day, 6, 0);
					break;
				case 2: // NOA - 6 mo
					this.dueDate = $scope.getDueDate(month, year, day, 6, 0);
					break;
				case 3: // Notice of Abandonment - 2 mo
					this.dueDate = $scope.getDueDate(month, year, day, 2, 0);
					break;
				case 4: // Office Action - 6 mo
					this.dueDate = $scope.getDueDate(month, year, day, 6, 0);
					break;
				case 5: // Extension 1 - 6 mo
					this.dueDate = $scope.getDueDate(month, year, day, 6, 0);
					break;
				case 6: // Extension 2 - 6 mo
					this.dueDate = $scope.getDueDate(month, year, day, 6, 0);
					break;
				case 7: // Extension 3 - 6 mo
					this.dueDate = $scope.getDueDate(month, year, day, 6, 0);
					break;
				case 8: // Extension 4 - 6 mo
					this.dueDate = $scope.getDueDate(month, year, day, 6, 3);
					break;
				case 9: // Extension 5 - 6 mo
					this.dueDate = $scope.getDueDate(month, year, day, 6, 14);
					break;
				default: // Registration Date - 5 yrs --> 10 yrs
					this.dueDate = $scope.getDueDate(month, year, day, 0, 5);
					this.secondDueDate = $scope.getDueDate(month, year, day, 0, 10);
			}
		};

	}
]);
