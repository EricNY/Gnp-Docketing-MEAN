'use strict';

// Configuring the Copyrights module
angular.module('copyrights').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('sidebar', 'Copyrights', 'copyrights', 'dropdown', '/copyrights(/.*)?', false, null, 20);
		Menus.addSubMenuItem('sidebar', 'copyrights', 'List Copyrights', 'copyrights');
		Menus.addSubMenuItem('sidebar', 'copyrights', 'Add Copyright', 'copyrights/create');
	}
]);
