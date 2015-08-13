'use strict';

//Conflicts service used to communicate Conflicts REST endpoints
angular.module('conflicts').factory('Conflicts', ['$resource',
	function($resource) {
		return $resource('conflicts/:conflictId', { conflictId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);