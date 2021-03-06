'use strict';

// Setting up route
angular.module('copyrights').config(['$stateProvider',
	function($stateProvider) {
		// Copyrsight state routing
		$stateProvider.
		state('app.listCopyrights', {
			url: '/copyrights',
			title: 'List Copyrights',
			templateUrl: 'modules/copyrights/views/list-copyrights.client.view.html'
		}).
		state('app.createCopyrights', {
			url: '/copyrights/create',
			title: 'New Copyrights',
			templateUrl: 'modules/copyrights/views/create-copyright.client.view.html'
		}).
		state('app.viewCopyrights', {
			url: '/copyrights/:copyrightId',
			title: 'View Copyrights',
			templateUrl: 'modules/copyrights/views/view-copyright.client.view.html',
			controller: 'CopyrightsController'
		}).
		state('app.editCopyrights', {
			title: 'Edit Copyrights',
			url: '/copyrights/:copyrightId/edit',
			templateUrl: 'modules/copyrights/views/edit-copyright.client.view.html'
		});
	}
]);
