'use strict';

// Configuring the Conflicts module
angular.module('conflicts').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('sidebar', 'Conflicts', 'conflicts', 'dropdown', '/conflicts(/.*)?', false, null, 20);
		Menus.addSubMenuItem('sidebar', 'conflicts', 'List Conflicts', 'conflicts');
		Menus.addSubMenuItem('sidebar', 'conflicts', 'Add Conflicts', 'conflicts/create');
	}
]);
