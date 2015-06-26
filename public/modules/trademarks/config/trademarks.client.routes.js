'use strict';

//Setting up route
angular.module('trademarks').config(['$stateProvider',
	function($stateProvider) {
		// Trademarks state routing
		$stateProvider.
		state('listTrademarks', {
			url: '/trademarks',
			templateUrl: 'modules/trademarks/views/list-trademarks.client.view.html'
		}).
		state('createTrademark', {
			url: '/trademarks/create',
			templateUrl: 'modules/trademarks/views/create-trademark.client.view.html'
		}).
		state('viewTrademark', {
			url: '/trademarks/:trademarkId',
			templateUrl: 'modules/trademarks/views/view-trademark.client.view.html'
		}).
		state('editTrademark', {
			url: '/trademarks/:trademarkId/edit',
			templateUrl: 'modules/trademarks/views/edit-trademark.client.view.html'
		});
	}
]);