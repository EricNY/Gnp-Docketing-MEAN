'use strict';

//Copyrights service used to communicate Copyrights REST endpoints
angular.module('copyrights').factory('Copyrights', ['$resource',
	function($resource) {
		return $resource('copyrights/:copyrightId', { copyrightId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);