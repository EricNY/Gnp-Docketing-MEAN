'use strict';


angular.module('core').controller('HomeController', ['$scope', '$http', 'Authentication',
	function($scope, $http, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		this.sendMail = function() {

			var data = ({
				contactName: this.contactName,
				contactEmail: this. contactEmail
			});

			$http.post('/', data).
				success(function(data, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available
					console.log('heyyyyyyy');
				}).
				error(function(data, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
			});

		};

	}
]);
