'use strict';

// Configuring the Articles module
angular.module('copyrights').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Copyrights', 'copyrights', 'dropdown', '/copyrights(/create)?');
		Menus.addSubMenuItem('topbar', 'copyrights', 'List Copyrights', 'copyrights');
		Menus.addSubMenuItem('topbar', 'copyrights', 'New Copyright', 'copyrights/create');
	}
]);