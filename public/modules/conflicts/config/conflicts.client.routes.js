// 'use strict';

// //Setting up route
// angular.module('conflicts').config(['$stateProvider',
// 	function($stateProvider) {
// 		// Conflicts state routing
// 		$stateProvider.
// 		state('listConflicts', {
// 			url: '/conflicts',
// 			templateUrl: 'modules/conflicts/views/list-conflicts.client.view.html'
// 		}).
// 		state('createConflict', {
// 			url: '/conflicts/create',
// 			templateUrl: 'modules/conflicts/views/create-conflict.client.view.html'
// 		}).
// 		state('viewConflict', {
// 			url: '/conflicts/:conflictId',
// 			templateUrl: 'modules/conflicts/views/view-conflict.client.view.html'
// 		}).
// 		state('editConflict', {
// 			url: '/conflicts/:conflictId/edit',
// 			templateUrl: 'modules/conflicts/views/edit-conflict.client.view.html'
// 		});
// 	}
// ]);


'use strict';

// Setting up route
angular.module('conflicts').config(['$stateProvider',
	function($stateProvider) {
		// Copyrsight state routing
		$stateProvider.
		state('app.listConflicts', {
			url: '/conflicts',
			title: 'List Conflicts',
			templateUrl: 'modules/conflicts/views/list-conflicts.client.view.html'
		}).
		state('app.createConflicts', {
			url: '/conflicts/create',
			title: 'New Conflicts',
			templateUrl: 'modules/conflicts/views/create-conflict.client.view.html'
		}).
		state('app.viewConflicts', {
			url: '/conflicts/:conflictId',
			title: 'View Conflicts',
			templateUrl: 'modules/conflicts/views/view-conflict.client.view.html',
			controller: 'ConflictsController'
		}).
		state('app.editConflicts', {
			title: 'Edit Conflicts',
			url: '/conflicts/:conflictId/edit',
			templateUrl: 'modules/conflicts/views/edit-conflict.client.view.html'
		});
	}
]);
