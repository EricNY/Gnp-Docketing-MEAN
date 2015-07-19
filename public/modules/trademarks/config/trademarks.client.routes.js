// 'use strict';

// //Setting up route
// angular.module('trademarks').config(['$stateProvider',
// 	function($stateProvider) {
// 		// Trademarks state routing
// 		$stateProvider.
// 		state('listTrademarks', {
// 			url: '/trademarks',
// 			templateUrl: 'modules/trademarks/views/list-trademarks.client.view.html'
// 		}).
// 		state('createTrademark', {
// 			url: '/trademarks/create',
// 			templateUrl: 'modules/trademarks/views/create-trademark.client.view.html'
// 		}).
// 		state('viewTrademark', {
// 			url: '/trademarks/:trademarkId',
// 			templateUrl: 'modules/trademarks/views/view-trademark.client.view.html'
// 		}).
// 		state('editTrademark', {
// 			url: '/trademarks/:trademarkId/edit',
// 			templateUrl: 'modules/trademarks/views/edit-trademark.client.view.html'
// 		});
// 	}
// ]);

'use strict';

// Setting up route
angular.module('trademarks').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('app.listTrademarks', {
			url: '/trademarks',
			title: 'List Trademarks',
			templateUrl: 'modules/trademarks/views/list-trademarks.client.view.html'
		}).
		state('app.createTrademarks', {
			url: '/trademarks/create',
			title: 'New Trademarks',
			templateUrl: 'modules/trademarks/views/create-trademark.client.view.html'
		}).
		state('app.viewTrademarks', {
			url: '/trademarks/:trademarkId',
			title: 'View Trademarks',
			templateUrl: 'modules/trademarks/views/view-trademark.client.view.html',
			controller: 'TrademarksController'
		}).
		state('app.editTrademarks', {
			title: 'Edit Trademarks',
			url: '/trademarks/:trademarkId/edit',
			templateUrl: 'modules/trademarks/views/edit-trademark.client.view.html'
		});
	}
]);
