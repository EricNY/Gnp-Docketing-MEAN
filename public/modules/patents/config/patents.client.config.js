// 'use strict';

// // Configuring the Articles module
// angular.module('patents').run(['Menus',
// 	function(Menus) {
// 		// Set top bar menu items
// 		Menus.addMenuItem('topbar', 'Patents', 'patents', 'dropdown', '/patents(/create)?');
// 		Menus.addSubMenuItem('topbar', 'patents', 'List Patents', 'patents');
// 		Menus.addSubMenuItem('topbar', 'patents', 'New Patent', 'patents/create');
// 	}
// ]);


'use strict';

// Configuring the Articles module
angular.module('patents').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('sidebar', 'Patents', 'patents', 'dropdown', '/patents(/.*)?', false, null, 20);
		Menus.addSubMenuItem('sidebar', 'patents', 'List Patents', 'patents');
		Menus.addSubMenuItem('sidebar', 'patents', 'Add Patent', 'patents/create');
	}
]);
