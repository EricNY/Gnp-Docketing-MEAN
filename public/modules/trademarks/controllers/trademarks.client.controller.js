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
			{id:10, name:'Registration Date'}
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
				comments					: this.comments
			});

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

			month = that.statusDate.getUTCMonth();
			year = that.statusDate.getUTCFullYear();
			day = that.statusDate.getUTCDate();

			switch( selectedOption ) {
				case 0: // Pending - 6 mo
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

// $scope.init = function () {
//     $scope.fetchJSON('https://tsdrapi.uspto.gov/ts/cd/status66/sn86557032/info.xml');
// };


// $scope.fetchJSON = function (url) {
// 		var display = function(results){console.log(results);};
//     var root = 'https://query.yahooapis.com/v1/public/yql?q=';
//     var yql = 'select * from xml where url="' + url + '"';
//     var proxy_url = root + encodeURIComponent(yql) + '&format=json&diagnostics=false&callback=display';
//     console.log('here?');
//     document.getElementsByTagName('body')[0].appendChild($scope.jsTag(proxy_url));
// };

// $scope.jsTag = function (url) {
//     var script = document.createElement('script');
//     script.setAttribute('type', 'text/javascript');
//     script.setAttribute('src', url);
//     return script;
// };

function requestCrossDomain( site, callback ) {
     
    // If no url was passed, exit.
    if ( !site ) {
        alert('No site was passed.');
        return false;
    }
     
    // Take the provided url, and add it to a YQL query. Make sure you encode it!
    var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + site + '"') + '&format=xml&callback=cbFunc';
console.log('just before getJSON');
console.log(yql);
    // Request that YSQL string, and run a callback function.
    // Pass a defined function to prevent cache-busting.
    $.getJSON( yql, cbFunc );
     
    function cbFunc(data) {
		 console.log('inside cbFunc');
		 console.log(data);
    // If we have something to work with...
    if ( data.results[0] ) {
        // Strip out all script tags, for security reasons.
        // BE VERY CAREFUL. This helps, but we should do more. 
        data = data.results[0].replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

        // If the user passed a callback, and it
        // is a function, call it, and send through the data var.
        if ( typeof callback === 'function') {
            callback(data);
        }
    }
    // Else, Maybe we requested a site that doesn't exist, and nothing returned.
    else throw new Error('Nothing returned from getJSON.');
    }
}


$scope.getTMData = function(){
	// $scope.init();

requestCrossDomain('https://tsdrapi.uspto.gov/ts/cd/status66/sn86557032/info.xml', function (results){
	console.log(results);
});

};

	}
]);
