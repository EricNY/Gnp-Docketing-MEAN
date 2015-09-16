'use strict';

// Trademarks controller
angular.module('trademarks').controller('TrademarksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Trademarks', '$http',
	function($scope, $stateParams, $location, Authentication, Trademarks, $http) {
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
			{id:10, name:'Registered'}
		];

		$scope.attorneys = [
			{id:0, name:'Pelaez'},
			{id:1, name:'Gabriel'},
			{id:2, name:'Cohen'}
		];

		// for search feature
		$scope.sortType     = 'owner';
		$scope.sortReverse  = false;
		$scope.searchTrademarks   = '';

		// Create new Trademark
		$scope.create = function() {
			// Create new Trademark object
			var trademark = new Trademarks ({
				owner							: this.owner,
				address						: this.address,
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
				attorney					: this.attorney,
				comments					: this.comments
			});
console.log(trademark);


			// Redirect after save
			trademark.$save(function(response) {
				$location.path('trademarks/' + response._id);

				// Clear form fields
				$scope.owner = '';
				$scope.address = '';
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
				$scope.attorney = '';
				$scope.comments = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Trademark
		$scope.remove = function(trademark) {
			var conf = confirm('Are you sure?');
			if (conf === true) {
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
			var dueDateMonth = month + month_offset + 1;
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
		$scope.calculateDueDates = function ( selectedOption, toggle ) {
			var that = this;
			var month, year, day;

			if (toggle === 'edit') {
				that = this.trademark;
			}

			// month = that.statusDate.getUTCMonth();
			// year = that.statusDate.getUTCFullYear();
			// day = that.statusDate.getUTCDate();

			month = $scope.statusDate.getUTCMonth();
			year = $scope.statusDate.getUTCFullYear();
			day = $scope.statusDate.getUTCDate();

// console.log(month);
// console.log(day);
// console.log(year);
// var sd = $scope.statusDate.split('-');
// console.log(sd);
// month = parseInt(sd[1]);
// year = parseInt(sd[0]);
// day = parseInt(sd[2]);			

			switch( selectedOption ) {
				case 0: // Pending - 6 mo
				// console.log(new Date($scope.getDueDate(month, year, day, 6, 0)));
					that.dueDate = new Date($scope.getDueDate(month, year, day, 6, 0));
					break;
				case 1: // Published - 6 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 6, 0) );
					break;
				case 2: // NOA - 6 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 6, 0) );
					break;
				case 3: // Notice of Abandonment - 2 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 2, 0) );
					break;
				case 4: // Office Action - 6 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 6, 0) );
					break;
				case 5: // Extension 1 - 6 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 6, 0) );
					break;
				case 6: // Extension 2 - 6 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 6, 0) );
					break;
				case 7: // Extension 3 - 6 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 6, 0) );
					break;
				case 8: // Extension 4 - 6 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 6, 0) );
					break;
				case 9: // Extension 5 - 6 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 6, 0) );
					break;
				default: // Registration Date - 5 yrs --> 10 yrs
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 0, 5) );
					that.secondDueDate = new Date( $scope.getDueDate(month, year, day, 0, 10) );
			}
		};

$scope.connectToUspto = function ( appNumber ) {
	// alert(applicationNumber);
		var that = this;
    var yql_url = 'https://query.yahooapis.com/v1/public/yql';
    var url = 'https://tsdrapi.uspto.gov/ts/cd/casestatus/sn' + appNumber + '/info.json';

    $.ajax({
      'url': yql_url,
      'data': {
        'q': 'SELECT * FROM json WHERE url="'+url+'"',
        'format': 'json',
        'jsonCompat': 'new',
      },
      'dataType': 'jsonp',
      'success': function(response) {
      	var usptoData = response.query.results.json.trademarks[0];
      	var fd = usptoData.status.filingDate;
      	fd = fd.split('-');
      	// console.log(usptoData.status.filingDate);
      	// console.log(fd);
				// $scope.owner = usptoData.parties.ownerGroups[10][0].name;
				$scope.owner = owner.value = usptoData.parties.ownerGroups[10][0].name;
				$scope.address = address.value = usptoData.parties.ownerGroups[10][0].address1;
				$scope.mark = mark.value = usptoData.status.markElement;
				$scope.country = country.value = usptoData.parties.ownerGroups[10][0].addressStateCountry.iso.code;		
				$scope.ic = ic.value = usptoData.gsList[0].internationalClasses[0].code;
				$scope.goodsAndServices = goodsandservices.value = usptoData.gsList[0].description;
	// api giving is dates as strings in the form of yyyy-mm-dd
				$scope.filingDate = new Date(usptoData.status.filingDate);
				// $scope.filingDate = usptoData.status.filingDate;
				filingdate.value = usptoData.status.filingDate;
				$scope.registrationDate = new Date(usptoData.status.usRegistrationDate);
				registrationdate.value = usptoData.status.usRegistrationDate;
				$scope.applicationNumber = applicationnumber.value = appNumber;
				$scope.registrationNumber = registrationnumber.value = usptoData.status.usRegistrationNumber;
				$scope.statusDate = new Date(usptoData.status.statusDate);
				statusdate.value = usptoData.status.statusDate;

      },
    });
};


	}
]);
