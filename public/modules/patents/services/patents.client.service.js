'use strict';

//Patents service used to communicate Patents REST endpoints
angular.module('patents').factory('Patents', ['$resource',
	function($resource) {
		return $resource('patents/:patentId', { patentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);