// 'use strict';

// // Configuring the Articles module
// angular.module('trademarks').run(['Menus',
// 	function(Menus) {
// 		// Set top bar menu items
// 		Menus.addMenuItem('topbar', 'Trademarks', 'trademarks', 'dropdown', '/trademarks(/create)?');
// 		Menus.addSubMenuItem('topbar', 'trademarks', 'List Trademarks', 'trademarks');
// 		Menus.addSubMenuItem('topbar', 'trademarks', 'New Trademark', 'trademarks/create');
// 	}
// ]);

'use strict';

// Configuring the Articles module
angular.module('trademarks').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('sidebar', 'Trademarks', 'trademarks', 'dropdown', '/trademarks(/.*)?', false, null, 20);
		Menus.addSubMenuItem('sidebar', 'trademarks', 'List Trademarks', 'trademarks');
		Menus.addSubMenuItem('sidebar', 'trademarks', 'Add Trademark', 'trademarks/create');
	}
]);
