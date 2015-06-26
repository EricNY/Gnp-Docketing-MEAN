'use strict';

//Setting up route
angular.module('copyrights').config(['$stateProvider',
	function($stateProvider) {
		// Copyrights state routing
		$stateProvider.
		state('listCopyrights', {
			url: '/copyrights',
			templateUrl: 'modules/copyrights/views/list-copyrights.client.view.html'
		}).
		state('createCopyright', {
			url: '/copyrights/create',
			templateUrl: 'modules/copyrights/views/create-copyright.client.view.html'
		}).
		state('viewCopyright', {
			url: '/copyrights/:copyrightId',
			templateUrl: 'modules/copyrights/views/view-copyright.client.view.html'
		}).
		state('editCopyright', {
			url: '/copyrights/:copyrightId/edit',
			templateUrl: 'modules/copyrights/views/edit-copyright.client.view.html'
		});
	}
]);