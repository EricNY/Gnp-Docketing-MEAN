'use strict';

// Configuring the Articles module
angular.module('trademarks').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Trademarks', 'trademarks', 'dropdown', '/trademarks(/create)?');
		Menus.addSubMenuItem('topbar', 'trademarks', 'List Trademarks', 'trademarks');
		Menus.addSubMenuItem('topbar', 'trademarks', 'New Trademark', 'trademarks/create');
	}
]);