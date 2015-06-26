'use strict';

//Setting up route
angular.module('patents').config(['$stateProvider',
	function($stateProvider) {
		// Patents state routing
		$stateProvider.
		state('listPatents', {
			url: '/patents',
			templateUrl: 'modules/patents/views/list-patents.client.view.html'
		}).
		state('createPatent', {
			url: '/patents/create',
			templateUrl: 'modules/patents/views/create-patent.client.view.html'
		}).
		state('viewPatent', {
			url: '/patents/:patentId',
			templateUrl: 'modules/patents/views/view-patent.client.view.html'
		}).
		state('editPatent', {
			url: '/patents/:patentId/edit',
			templateUrl: 'modules/patents/views/edit-patent.client.view.html'
		});
	}
]);