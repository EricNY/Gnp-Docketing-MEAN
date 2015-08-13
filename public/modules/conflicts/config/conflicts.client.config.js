// 'use strict';

// // Configuring the Articles module
// angular.module('conflicts').run(['Menus',
// 	function(Menus) {
// 		// Set top bar menu items
// 		Menus.addMenuItem('topbar', 'Conflicts', 'conflicts', 'dropdown', '/conflicts(/create)?');
// 		Menus.addSubMenuItem('topbar', 'conflicts', 'List Conflicts', 'conflicts');
// 		Menus.addSubMenuItem('topbar', 'conflicts', 'New Conflict', 'conflicts/create');
// 	}
// ]);


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
