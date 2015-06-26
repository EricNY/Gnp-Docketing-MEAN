'use strict';

//Trademarks service used to communicate Trademarks REST endpoints
angular.module('trademarks').factory('Trademarks', ['$resource',
	function($resource) {
		return $resource('trademarks/:trademarkId', { trademarkId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);