'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'angleApp';
	// var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];
	var applicationModuleVendorDependencies = ['ngRoute', 'ngAnimate', 'ngStorage','ngTouch', 'ngCookies', 'pascalprecht.translate', 'ui.bootstrap', 'ui.router', 'oc.lazyLoad', 'cfp.loadingBar', 'ngSanitize', 'ngResource', 'ui.utils'];
	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('conflicts');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('copyrights');
/*!
 * 
 * Angle - Bootstrap Admin App + AngularJS
 * 
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: http://support.wrapbootstrap.com/knowledge_base/topics/usage-licenses
 * 
 */
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');

angular.module('core').run(["$rootScope", "$state", "$stateParams",  '$window', '$templateCache',
  function ($rootScope, $state, $stateParams, $window, $templateCache) {

    // Set reference to access them from any scope
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$storage = $window.localStorage;

    // Uncomment this to disables template cache
    /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (typeof(toState) !== 'undefined'){
          $templateCache.remove(toState.templateUrl);
        }
    });*/

    // Scope Globals
    // ----------------------------------- 
    $rootScope.app = {
      name: 'G&P Law Docketing System',
      description: 'Angular Bootstrap Admin Template',
      year: ((new Date()).getFullYear()),
      layout: {
        isFixed: true,
        isCollapsed: false,
        isBoxed: false,
        isRTL: false,
        horizontal: false,
        isFloat: false,
        asideHover: false,
        theme: null
      },
      useFullLayout: false,
      hiddenFooter: false,
      offsidebarOpen: false,
      asideToggled: false,
      viewAnimation: 'ng-fadeInUp'
    };
    $rootScope.user = {
      name:     'John',
      job:      'ng-Dev',
      picture:  'app/img/user/02.jpg'
    };
  }
]);

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('page');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('patents');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('trademarks');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
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

'use strict';

// Setting up route
angular.module('conflicts').config(['$stateProvider',
	function($stateProvider) {
		// Copyrsight state routing
		$stateProvider.
		state('app.listConflicts', {
			url: '/conflicts',
			title: 'List Conflicts',
			templateUrl: 'modules/conflicts/views/list-conflicts.client.view.html'
		}).
		state('app.createConflicts', {
			url: '/conflicts/create',
			title: 'New Conflicts',
			templateUrl: 'modules/conflicts/views/create-conflict.client.view.html'
		}).
		state('app.viewConflicts', {
			url: '/conflicts/:conflictId',
			title: 'View Conflicts',
			templateUrl: 'modules/conflicts/views/view-conflict.client.view.html',
			controller: 'ConflictsController'
		}).
		state('app.editConflicts', {
			title: 'Edit Conflicts',
			url: '/conflicts/:conflictId/edit',
			templateUrl: 'modules/conflicts/views/edit-conflict.client.view.html'
		});
	}
]);

'use strict';

// Conflicts controller
angular.module('conflicts').controller('ConflictsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Conflicts',
	function($scope, $stateParams, $location, Authentication, Conflicts) {
		$scope.authentication = Authentication;

		$scope.conflictTypeOptions = [
			{id:0, name:'Opposition'},
			{id:1, name:'Cancellation'},
			{id:2, name:'Ex Parte'}
		];

		$scope.attorneys = [
			{id:0, name:'Pelaez'},
			{id:1, name:'Gabriel'},
			{id:2, name:'Cohen'}
		];

		// for search feature
		$scope.sortType     = 'conflictType';
		$scope.sortReverse  = false;
		$scope.searchConflicts = '';

		// Create new Conflict
		$scope.create = function() {
			// Create new Conflict object
			var conflict = new Conflicts ({
				conflictType					: this.conflictType,
				proceedingNumber			: this.proceedingNumber,
				registrationNumber		: this.registrationNumber,
				mark									: this.mark,
				petitioner						: this.petitioner,
				respondent						: this.respondent,
				opposingCounselName		: this.opposingCounselName,
				opposingCounselAddress: this.opposingCounselAddress,
				attorney							: this.attorney
			});

			// Redirect after save
			conflict.$save(function(response) {
				$location.path('conflicts/' + response._id);

				// Clear form fields
				$scope.conflictType = '';
				$scope.proceedingNumber = '';
				$scope.registrationNumber = '';
				$scope.mark = '';
				$scope.petitioner = '';
				$scope.respondent = '';
				$scope.opposingCounselName = '';
				$scope.opposingCounselAddress = '';
				$scope.attorney = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Conflict
		$scope.remove = function(conflict) {
			var conf = confirm('Are you sure?');
			if (conf === true) {
				if ( conflict ) {
					conflict.$remove();

					for (var i in $scope.conflicts) {
						if ($scope.conflicts [i] === conflict) {
							$scope.conflicts.splice(i, 1);
						}
					}
				} else {
					$scope.conflict.$remove(function() {
						$location.path('conflicts');
					});
				}
			}
		};

		// Update existing Conflict
		$scope.update = function() {
			var conflict = $scope.conflict;

			conflict.$update(function() {
				$location.path('conflicts/' + conflict._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Conflicts
		$scope.find = function() {
			$scope.conflicts = Conflicts.query();
		};

		// Find existing Conflict
		$scope.findOne = function() {
			$scope.conflict = Conflicts.get({
				conflictId: $stateParams.conflictId
			});
		};

		// direct to show page
    $scope.listItemClick = function(conflictId) {
      location.href = '#!/conflicts/' + conflictId;
    };

	}
]);

'use strict';

//Conflicts service used to communicate Conflicts REST endpoints
angular.module('conflicts').factory('Conflicts', ['$resource',
	function($resource) {
		return $resource('conflicts/:conflictId', { conflictId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
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

'use strict';

// Copyrights controller
angular.module('copyrights').controller('CopyrightsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Copyrights',
	function($scope, $stateParams, $location, Authentication, Copyrights) {
		$scope.authentication = Authentication;

		$scope.workTypeOptions = [
			{id:0, name:'TX'},
			{id:1, name:'VA'},
			{id:2, name:'SR'},
			{id:3, name:'PA'}
		];

		$scope.attorneys = [
			{id:0, name:'Pelaez'},
			{id:1, name:'Gabriel'},
			{id:2, name:'Cohen'}
		];

		// for search feature
		$scope.sortType     = 'owner';
		$scope.sortReverse  = false;
		$scope.searchCopyrights   = '';

		// Create new Copyright
		$scope.create = function() {
			// Create new Copyright object
			var copyright = new Copyrights ({
				owner							: this.owner,
				address						: this.address,
				author						: this.author,
				workType					: this.workType,
				workTitle					: this.workTitle,
				publishedDate			: this.publishedDate,
				registrationDate	: this.registrationDate,
				registrationNumber: this.registrationNumber,
				attorney					: this.attorney,
				comments					: this.comments
			});

			// Redirect after save
			copyright.$save(function(response) {
				$location.path('copyrights/' + response._id);

				// Clear form fields
				$scope.owner = '';
				$scope.address = '';
				$scope.author = '';
				$scope.workType = '';
				$scope.workTitle = '';
				$scope.publishedDate = '';
				$scope.registrationDate = '';
				$scope.registrationNumber = '';
				$scope.attorney = '';
				$scope.comments = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Copyright
		$scope.remove = function(copyright) {
			var conf = confirm('Are you sure?');
			if (conf === true) {
				if ( copyright ) {
					copyright.$remove();

					for (var i in $scope.copyrights) {
						if ($scope.copyrights [i] === copyright) {
							$scope.copyrights.splice(i, 1);
						}
					}
				} else {
					$scope.copyright.$remove(function() {
						$location.path('copyrights');
					});
				}
			}
		};

		// Update existing Copyright
		$scope.update = function() {
			var copyright = $scope.copyright;

			copyright.$update(function() {
				$location.path('copyrights/' + copyright._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Copyrights
		$scope.find = function() {
			$scope.copyrights = Copyrights.query();
		};

		// Find existing Copyright
		$scope.findOne = function() {
			$scope.copyright = Copyrights.get({
				copyrightId: $stateParams.copyrightId
			});
		};

		// direct to show page
    $scope.listItemClick = function(copyrightId) {
      location.href = '#!/copyrights/' + copyrightId;
    };
	}
]);

'use strict';

//Copyrights service used to communicate Copyrights REST endpoints
angular.module('copyrights').factory('Copyrights', ['$resource',
	function($resource) {
		return $resource('copyrights/:copyrightId', { copyrightId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Core module
angular.module('core').run(['Menus',
  function(Menus) {

    // Add default menu entry
    Menus.addMenuItem('sidebar', 'Home', 'home', null, '/home', true, null, null, 'icon-home');

  }
]).config(['$ocLazyLoadProvider', 'APP_REQUIRES', function ($ocLazyLoadProvider, APP_REQUIRES) {
  // Lazy Load modules configuration
  $ocLazyLoadProvider.config({
    debug: false,
    events: true,
    modules: APP_REQUIRES.modules
  });

}]).config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
  function ( $controllerProvider, $compileProvider, $filterProvider, $provide) {
  // registering components after bootstrap
  angular.module('core').controller = $controllerProvider.register;
  angular.module('core').directive  = $compileProvider.directive;
  angular.module('core').filter     = $filterProvider.register;
  angular.module('core').factory    = $provide.factory;
  angular.module('core').service    = $provide.service;
  angular.module('core').constant   = $provide.constant;
  angular.module('core').value      = $provide.value;

}]).config(['$translateProvider', function ($translateProvider) {

  $translateProvider.useStaticFilesLoader({
    prefix : 'modules/core/i18n/',
    suffix : '.json'
  });
  $translateProvider.preferredLanguage('en');
  $translateProvider.useLocalStorage();

}])
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {

  cfpLoadingBarProvider.includeBar = true;
  cfpLoadingBarProvider.includeSpinner = false;
  cfpLoadingBarProvider.latencyThreshold = 500;
  cfpLoadingBarProvider.parentSelector = '.wrapper > section';
}]);

/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/
angular.module('core')
  .constant('APP_COLORS', {
    'primary':                '#5d9cec',
    'success':                '#27c24c',
    'info':                   '#23b7e5',
    'warning':                '#ff902b',
    'danger':                 '#f05050',
    'inverse':                '#131e26',
    'green':                  '#37bc9b',
    'pink':                   '#f532e5',
    'purple':                 '#7266ba',
    'dark':                   '#3a3f51',
    'yellow':                 '#fad732',
    'gray-darker':            '#232735',
    'gray-dark':              '#3a3f51',
    'gray':                   '#dde6e9',
    'gray-light':             '#e4eaec',
    'gray-lighter':           '#edf1f2'
  })
  .constant('APP_MEDIAQUERY', {
    'desktopLG':             1200,
    'desktop':                992,
    'tablet':                 768,
    'mobile':                 480
  })
  .constant('APP_REQUIRES', {
    // jQuery based and standalone scripts
    scripts: {
      'modernizr':          ['/lib/modernizr/modernizr.js'],
      'icons':              ['/lib/fontawesome/css/font-awesome.min.css',
                             '/lib/simple-line-icons/css/simple-line-icons.css']
    },
    // Angular based script (use the right module name)
    modules: [
      // { name: 'toaster', files: ['/lib/angularjs-toaster/toaster.js','/lib/angularjs-toaster/toaster.css'] }
    ]

  })
;
/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

angular.module('core').config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  'use strict';

  // Set the following to true to enable the HTML5 Mode
  // You may have to set <base> tag in index and a routing configuration in your server
  $locationProvider.html5Mode(false);

  // default route
  $urlRouterProvider.otherwise('/home');

  // 
  // Application Routes
  // -----------------------------------   
  $stateProvider
    .state('app', {
      // url: '/',
      abstract: true,
      templateUrl: 'modules/core/views/core.client.view.html',
      resolve: helper.resolveFor('modernizr', 'icons')
    })
    .state('app.home', {
      url: '/home',
      templateUrl: 'modules/core/views/home.client.view.html'
    })
    // 
    // CUSTOM RESOLVES
    //   Add your own resolves properties
    //   following this object extend
    //   method
    // ----------------------------------- 
    // .state('app.someroute', {
    //   url: '/some_url',
    //   templateUrl: 'path_to_template.html',
    //   controller: 'someController',
    //   resolve: angular.extend(
    //     helper.resolveFor(), {
    //     // YOUR RESOLVES GO HERE
    //     }
    //   )
    // })
    ;

}]);

/**=========================================================
 * Module: main.js
 * Main Application Controller
 =========================================================*/

angular.module('core').controller('AppController',
  ['$rootScope', '$scope', '$state', '$translate', '$window', '$localStorage', '$timeout', 'colors', 'browser', 'cfpLoadingBar', 'Authentication',
  function($rootScope, $scope, $state, $translate, $window, $localStorage, $timeout, colors, browser, cfpLoadingBar, Authentication) {
    "use strict";

    // This provides Authentication context.
    $scope.authentication = Authentication;

    // Loading bar transition
    // ----------------------------------- 
    var thBar;
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if($('.wrapper > section').length) // check if bar container exists
          thBar = $timeout(function() {
            cfpLoadingBar.start();
          }, 0); // sets a latency Threshold
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        event.targetScope.$watch("$viewContentLoaded", function () {
          $timeout.cancel(thBar);
          cfpLoadingBar.complete();
        });
    });


    // Hook not found
    $rootScope.$on('$stateNotFound',
      function(event, unfoundState, fromState, fromParams) {
          console.log(unfoundState.to); // "lazy.state"
          console.log(unfoundState.toParams); // {a:1, b:2}
          console.log(unfoundState.options); // {inherit:false} + default options
      });
    // Hook error
    $rootScope.$on('$stateChangeError',
      function(event, toState, toParams, fromState, fromParams, error){
        console.log(error);
      });
    // Hook success
    $rootScope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState, fromParams) {
        // display new view from top
        $window.scrollTo(0, 0);
        // Save the route title
        $rootScope.currTitle = $state.current.title;
      });

    $rootScope.currTitle = $state.current.title;
    $rootScope.pageTitle = function() {
      return $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
    };

    // iPad may presents ghost click issues
    // if( ! browser.ipad )
      // FastClick.attach(document.body);

    // Close submenu when sidebar change from collapsed to normal
    $rootScope.$watch('app.layout.isCollapsed', function(newValue, oldValue) {
      if( newValue === false )
        $rootScope.$broadcast('closeSidebarMenu');
    });

    // Restore layout settings
    if( angular.isDefined($localStorage.layout) )
      $scope.app.layout = $localStorage.layout;
    else
      $localStorage.layout = $scope.app.layout;

    $rootScope.$watch("app.layout", function () {
      $localStorage.layout = $scope.app.layout;
    }, true);

    
    // Allows to use branding color with interpolation
    // {{ colorByName('primary') }}
    $scope.colorByName = colors.byName;

    // Internationalization
    // ----------------------

    $scope.language = {
      // Handles language dropdown
      listIsOpen: false,
      // list of available languages
      available: {
        'en':       'English',
        'es_AR':    'Español'
      },
      // display always the current ui language
      init: function () {
        var proposedLanguage = $translate.proposedLanguage() || $translate.use();
        var preferredLanguage = $translate.preferredLanguage(); // we know we have set a preferred one in app.config
        $scope.language.selected = $scope.language.available[ (proposedLanguage || preferredLanguage) ];
      },
      set: function (localeId, ev) {
        // Set the new idiom
        $translate.use(localeId);
        // save a reference for the current language
        $scope.language.selected = $scope.language.available[localeId];
        // finally toggle dropdown
        $scope.language.listIsOpen = ! $scope.language.listIsOpen;
      }
    };

    $scope.language.init();

    // Applies animation to main view for the next pages to load
    $timeout(function(){
      $rootScope.mainViewAnimation = $rootScope.app.viewAnimation;
    });

    // cancel click event easily
    $rootScope.cancel = function($event) {
      $event.stopPropagation();
    };

}]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';

angular.module('core').controller('SidebarController',
  ['$rootScope', '$scope', '$state', 'Authentication', 'Menus', 'Utils',
  function($rootScope, $scope, $state,  Authentication, Menus, Utils) {

    $scope.authentication = Authentication;
    $scope.menu = Menus.getMenu('sidebar');

    var collapseList = [];

    // demo: when switch from collapse to hover, close all items
    $rootScope.$watch('app.layout.asideHover', function(oldVal, newVal){
      if ( newVal === false && oldVal === true) {
        closeAllBut(-1);
      }
    });

    // Check item and children active state
    var isActive = function(item) {

      if(!item) return;

      if( !item.sref || item.sref == '#') {
        var foundActive = false;
        angular.forEach(item.submenu, function(value, key) {
          if(isActive(value)) foundActive = true;
        });
        return foundActive;
      }
      else
        return $state.is(item.sref) || $state.includes(item.sref);
    };

    // Load menu from json file
    // ----------------------------------- 
    
    $scope.getMenuItemPropClasses = function(item) {
      return (item.heading ? 'nav-heading' : '') +
             (isActive(item) ? ' active' : '') ;
    };

    // Handle sidebar collapse items
    // ----------------------------------- 

    $scope.addCollapse = function($index, item) {
      collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
    };

    $scope.isCollapse = function($index) {
      return (collapseList[$index]);
    };

    $scope.toggleCollapse = function($index, isParentItem) {


      // collapsed sidebar doesn't toggle drodopwn
      if( Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover ) return true;

      // make sure the item index exists
      if( angular.isDefined( collapseList[$index] ) ) {
        collapseList[$index] = !collapseList[$index];
        closeAllBut($index);
      }
      else if ( isParentItem ) {
        closeAllBut(-1);
      }
    
      return true;
    
    };

    function closeAllBut(index) {
      index += '';
      for(var i in collapseList) {
        if(index < 0 || index.indexOf(i) < 0)
          collapseList[i] = true;
      }
    }

  }
]);

'use strict';

angular.module('core').directive('formatDate', [
	function() {
	  return {
	   require: 'ngModel',
	    link: function(scope, elem, attr, modelCtrl) {
	      modelCtrl.$formatters.push(function(modelValue){
	        return new Date(modelValue);
	      });
	    }
	  };
	// 	return {
	// 		template: '<div></div>',
	// 		restrict: 'E',
	// 		link: function postLink(scope, element, attrs) {
	// 			// Format date directive logic
	// 			// ...

	// 			element.text('this is the formatDate directive');
	// 		}
	// 	};
	}
]);

/**=========================================================
 * Module: navbar-search.js
 * Navbar search toggler * Auto dismiss on ESC key
 =========================================================*/

angular.module('core').directive('searchOpen', ['navSearch', function(navSearch) {
  'use strict';

  return {
    restrict: 'A',
    controller: ["$scope", "$element", function($scope, $element) {
      $element
        .on('click', function (e) { e.stopPropagation(); })
        .on('click', navSearch.toggle);
    }]
  };

}]).directive('searchDismiss', ['navSearch', function(navSearch) {
  'use strict';

  var inputSelector = '.navbar-form input[type="text"]';

  return {
    restrict: 'A',
    controller: ["$scope", "$element", function($scope, $element) {

      $(inputSelector)
        .on('click', function (e) { e.stopPropagation(); })
        .on('keyup', function(e) {
          if (e.keyCode == 27) // ESC
            navSearch.dismiss();
        });
        
      // click anywhere closes the search
      $(document).on('click', navSearch.dismiss);
      // dismissable options
      $element
        .on('click', function (e) { e.stopPropagation(); })
        .on('click', navSearch.dismiss);
    }]
  };

}]);


/**=========================================================
 * Module: sidebar.js
 * Wraps the sidebar and handles collapsed state
 =========================================================*/

/* jshint -W026 */
angular.module('core').directive('sidebar', ['$rootScope', '$timeout', '$window', 'Utils', function($rootScope, $timeout, $window, Utils) {
  'use strict';
  var $win  = $($window);
  var $body = $('body');
  var $scope;
  var $sidebar;
  var currentState = $rootScope.$state.current.name;

  return {
    restrict: 'EA',
    template: '<nav class="sidebar" ng-transclude></nav>',
    transclude: true,
    replace: true,
    link: function(scope, element, attrs) {
      
      $scope   = scope;
      $sidebar = element;

      var eventName = Utils.isTouch() ? 'click' : 'mouseenter' ;
      var subNav = $();
      $sidebar.on( eventName, '.nav > li', function() {

        if( Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover ) {

          subNav.trigger('mouseleave');
          subNav = toggleMenuItem( $(this) );

          // Used to detect click and touch events outside the sidebar          
          sidebarAddBackdrop();

        }

      });

      scope.$on('closeSidebarMenu', function() {
        removeFloatingNav();
      });

      // Normalize state when resize to mobile
      $win.on('resize', function() {
        if( ! Utils.isMobile() )
          asideToggleOff();
      });

      // Adjustment on route changes
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        currentState = toState.name;
        // Hide sidebar automatically on mobile
        asideToggleOff();

        $rootScope.$broadcast('closeSidebarMenu');
      });

      // Autoclose when click outside the sidebar
      if ( angular.isDefined(attrs.sidebarAnyclickClose) ) {
            
        var wrapper = $('.wrapper');
        var sbclickEvent = 'click.sidebar';
        
        $rootScope.$watch('app.asideToggled', watchExternalClicks);

      }

      //////

      function watchExternalClicks(newVal) {
        // if sidebar becomes visible
        if ( newVal === true ) {
          $timeout(function(){ // render after current digest cycle
            wrapper.on(sbclickEvent, function(e){
              // if not child of sidebar
              if( ! $(e.target).parents('.aside').length ) {
                asideToggleOff();
              }
            });
          });
        }
        else {
          // dettach event
          wrapper.off(sbclickEvent);
        }
      }

      function asideToggleOff() {
        $rootScope.app.asideToggled = false;
        if(!$scope.$$phase) $scope.$apply(); // anti-pattern but sometimes necessary
      }
    }
  };

  function sidebarAddBackdrop() {
    var $backdrop = $('<div/>', { 'class': 'dropdown-backdrop'} );
    $backdrop.insertAfter('.aside-inner').on("click mouseenter", function () {
      removeFloatingNav();
    });
  }

  // Open the collapse sidebar submenu items when on touch devices 
  // - desktop only opens on hover
  function toggleTouchItem($element){
    $element
      .siblings('li')
      .removeClass('open')
      .end()
      .toggleClass('open');
  }

  // Handles hover to open items under collapsed menu
  // ----------------------------------- 
  function toggleMenuItem($listItem) {

    removeFloatingNav();

    var ul = $listItem.children('ul');
    
    if( !ul.length ) return $();
    if( $listItem.hasClass('open') ) {
      toggleTouchItem($listItem);
      return $();
    }

    var $aside = $('.aside');
    var $asideInner = $('.aside-inner'); // for top offset calculation
    // float aside uses extra padding on aside
    var mar = parseInt( $asideInner.css('padding-top'), 0) + parseInt( $aside.css('padding-top'), 0);
    var subNav = ul.clone().appendTo( $aside );
    
    toggleTouchItem($listItem);

    var itemTop = ($listItem.position().top + mar) - $sidebar.scrollTop();
    var vwHeight = $win.height();

    subNav
      .addClass('nav-floating')
      .css({
        position: $scope.app.layout.isFixed ? 'fixed' : 'absolute',
        top:      itemTop,
        bottom:   (subNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
      });

    subNav.on('mouseleave', function() {
      toggleTouchItem($listItem);
      subNav.remove();
    });

    return subNav;
  }

  function removeFloatingNav() {
    $('.dropdown-backdrop').remove();
    $('.sidebar-subnav.nav-floating').remove();
    $('.sidebar li.open').removeClass('open');
  }

}]);
(function() {
    'use strict';

    angular
      .module('core')
      .service('browser', function () {
        return window.jQBrowser;
      });

    

})();

/**=========================================================
 * Module: colors.js
 * Services to retrieve global colors
 =========================================================*/
 
angular.module('core').factory('colors', ['APP_COLORS', function(colors) {
  'use strict';
  return {
    byName: function(name) {
      return (colors[name] || '#fff');
    }
  };

}]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position,
																iconClass, translateKey, alert) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender,
				iconClass: iconClass || 'fa fa-file-o',
				translate: translateKey,
				alert: alert
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
		//Adding the sidebar menu
		this.addMenu('sidebar');
	}
]);
/**=========================================================
 * Module: nav-search.js
 * Services to share navbar search functions
 =========================================================*/
 
angular.module('core').service('navSearch', function() {
  'use strict';
  var navbarFormSelector = 'form.navbar-form';
  return {
    toggle: function() {
      
      var navbarForm = $(navbarFormSelector);

      navbarForm.toggleClass('open');
      
      var isOpen = navbarForm.hasClass('open');
      
      navbarForm.find('input')[isOpen ? 'focus' : 'blur']();

    },

    dismiss: function() {
      $(navbarFormSelector)
        .removeClass('open')      // Close control
        .find('input[type="text"]').blur() // remove focus
        .val('')                    // Empty input
        ;
    }
  };

});
/**=========================================================
 * Module: helpers.js
 * Provides helper functions for routes definition
 =========================================================*/

/* jshint -W026 */
/* jshint -W003 */
angular.module('core').provider('RouteHelpers', ['APP_REQUIRES', function (appRequires) {
  "use strict";

  // Set here the base of the relative path
  // for all app views
  this.basepath = function (uri) {
    return 'app/views/' + uri;
  };

  // Generates a resolve object by passing script names
  // previously configured in constant.APP_REQUIRES
  this.resolveFor = function () {
    var _args = arguments;
    return {
      deps: ['$ocLazyLoad','$q', function ($ocLL, $q) {
        // Creates a promise chain for each argument
        var promise = $q.when(1); // empty promise
        for(var i=0, len=_args.length; i < len; i ++){
          promise = andThen(_args[i]);
        }
        return promise;

        // creates promise to chain dynamically
        function andThen(_arg) {
          // also support a function that returns a promise
          if(typeof _arg == 'function')
              return promise.then(_arg);
          else
              return promise.then(function() {
                // if is a module, pass the name. If not, pass the array
                var whatToLoad = getRequired(_arg);
                // simple error check
                if(!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                // finally, return a promise
                return $ocLL.load( whatToLoad );
              });
        }
        // check and returns required data
        // analyze module items with the form [name: '', files: []]
        // and also simple array of script files (for not angular js)
        function getRequired(name) {
          if (appRequires.modules)
              for(var m in appRequires.modules)
                  if(appRequires.modules[m].name && appRequires.modules[m].name === name)
                      return appRequires.modules[m];
          return appRequires.scripts && appRequires.scripts[name];
        }

      }]};
  }; // resolveFor

  // not necessary, only used in config block for routes
  this.$get = function(){};

}]);


/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

angular.module('core').service('Utils', ["$window", "APP_MEDIAQUERY", function($window, APP_MEDIAQUERY) {
    'use strict';
    
    var $html = angular.element("html"),
        $win  = angular.element($window),
        $body = angular.element('body');

    return {
      // DETECTION
      support: {
        transition: (function() {
          var transitionEnd = (function() {

            var element = document.body || document.documentElement,
              transEndEventNames = {
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend',
                transition: 'transitionend'
              }, name;

            for (name in transEndEventNames) {
              if (element.style[name] !== undefined) return transEndEventNames[name];
            }
          }());

          return transitionEnd && { end: transitionEnd };
        })(),
        animation: (function() {
          var animationEnd = (function() {

            var element = document.body || document.documentElement,
              animEndEventNames = {
                WebkitAnimation: 'webkitAnimationEnd',
                MozAnimation: 'animationend',
                OAnimation: 'oAnimationEnd oanimationend',
                animation: 'animationend'
              }, name;

            for (name in animEndEventNames) {
              if (element.style[name] !== undefined) return animEndEventNames[name];
            }
          }());

          return animationEnd && { end: animationEnd };
        })(),
        requestAnimationFrame: window.requestAnimationFrame ||
                               window.webkitRequestAnimationFrame ||
                               window.mozRequestAnimationFrame ||
                               window.msRequestAnimationFrame ||
                               window.oRequestAnimationFrame ||
                               function(callback){ window.setTimeout(callback, 1000/60); },
        touch: (
            ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
            (window.DocumentTouch && document instanceof window.DocumentTouch)  ||
            (window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 0) || //IE 10
            (window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 0) || //IE >=11
            false
        ),
        mutationobserver: (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null)
      },
      // UTILITIES
      isInView: function(element, options) {

        var $element = $(element);

        if (!$element.is(':visible')) {
          return false;
        }

        var window_left = $win.scrollLeft(),
            window_top  = $win.scrollTop(),
            offset      = $element.offset(),
            left        = offset.left,
            top         = offset.top;

        options = $.extend({topoffset:0, leftoffset:0}, options);

        if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
            left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
          return true;
        } else {
          return false;
        }
      },
      langdirection: $html.attr("dir") == "rtl" ? "right" : "left",
      isTouch: function () {
        return $html.hasClass('touch');
      },
      isSidebarCollapsed: function () {
        return $body.hasClass('aside-collapsed');
      },
      isSidebarToggled: function () {
        return $body.hasClass('aside-toggled');
      },
      isMobile: function () {
        return $win.width() < APP_MEDIAQUERY.tablet;
      }
    };
}]);
'use strict';

// Setting up route
angular.module('page').config(['$stateProvider',
  function($stateProvider) {
    // Users state routing
    $stateProvider.
    state('page', {
      url: '/page',
      templateUrl: 'modules/page/views/page.client.view.html'
    });
  }
]);

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

// 'use strict';

// //Setting up route
// angular.module('patents').config(['$stateProvider',
// 	function($stateProvider) {
// 		// Patents state routing
// 		$stateProvider.
// 		state('listPatents', {
// 			url: '/patents',
// 			templateUrl: 'modules/patents/views/list-patents.client.view.html'
// 		}).
// 		state('createPatent', {
// 			url: '/patents/create',
// 			templateUrl: 'modules/patents/views/create-patent.client.view.html'
// 		}).
// 		state('viewPatent', {
// 			url: '/patents/:patentId',
// 			templateUrl: 'modules/patents/views/view-patent.client.view.html'
// 		}).
// 		state('editPatent', {
// 			url: '/patents/:patentId/edit',
// 			templateUrl: 'modules/patents/views/edit-patent.client.view.html'
// 		});
// 	}
// ]);


'use strict';

// Setting up route
angular.module('patents').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('app.listPatents', {
			url: '/patents',
			title: 'List Patents',
			templateUrl: 'modules/patents/views/list-patents.client.view.html'
		}).
		state('app.createPatents', {
			url: '/patents/create',
			title: 'New Patents',
			templateUrl: 'modules/patents/views/create-patent.client.view.html'
		}).
		state('app.viewPatents', {
			url: '/patents/:patentId',
			title: 'View Patents',
			templateUrl: 'modules/patents/views/view-patent.client.view.html',
			controller: 'PatentsController'
		}).
		state('app.editPatents', {
			title: 'Edit Patents',
			url: '/patents/:patentId/edit',
			templateUrl: 'modules/patents/views/edit-patent.client.view.html'
		});
	}
]);

'use strict';

// Patents controller
angular.module('patents').controller('PatentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Patents',
	function($scope, $stateParams, $location, Authentication, Patents) {
		$scope.authentication = Authentication;

		$scope.statusOptions = [
			{id:0, name:'Provisional Application'},
			{id:1, name:'Notice to File Missing Parts'},
			{id:2, name:'Restriction Requirement'},
			{id:3, name:'Office Action'},
			{id:4, name:'Extension 1'},
			{id:5, name:'Extension 2'},
			{id:6, name:'Extension 3'},
			{id:7, name:'NOA'},
			{id:8, name:'Issued'},
			{id:9, name:'Design Patent'},
			{id:10, name:'Utility Patent'},
			{id:11, name:'Filed'}
		];

		$scope.attorneys = [
			{id:0, name:'Pelaez'},
			{id:1, name:'Gabriel'},
			{id:2, name:'Cohen'}
		];

		// for search feature
		$scope.sortType     = 'owner';
		$scope.sortReverse  = false;
		$scope.searchPatents   = '';

		// Create new Patent
		$scope.create = function() {
			// Create new Patent object
			var patent = new Patents ({
				owner							: this.owner,
				address						: this.address,
				nature						: this.nature,
				country						: this.country,
				filingDate				: this.filingDate,
				issueDate					: this.issueDate,
				applicationNumber	: this.applicationNumber,
				patentNumber			: this.patentNumber,
				patentStatus			: this.patentStatus,
				statusDate				: this.statusDate,
				dueDate						: this.dueDate,
				secondDueDate			: this.secondDueDate,
				thirdDueDate			: this.thirdDueDate,
				attorney					: this.attorney,
				comments					: this.comments
			});

			// Redirect after save
			patent.$save(function(response) {
				$location.path('patents/' + response._id);

				// Clear form fields
				$scope.owner = '';
				$scope.address = '';
				$scope.nature = '';
				$scope.country = '';
				$scope.filingDate = '';
				$scope.issueDate = '';
				$scope.applicationNumber = '';
				$scope.patentNumber = '';
				$scope.patentStatus = '';
				$scope.statusDate = '';
				$scope.dueDate = '';
				$scope.secondDueDate = '';
				$scope.thirdDueDate = '';
				$scope.attorney = '';
				$scope.comments = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Patent
		$scope.remove = function(patent) {
			var conf = confirm('Are you sure?');
			if (conf === true) {
				if ( patent ) {
					patent.$remove();

					for (var i in $scope.patents) {
						if ($scope.patents [i] === patent) {
							$scope.patents.splice(i, 1);
						}
					}
				} else {
					$scope.patent.$remove(function() {
						$location.path('patents');
					});
				}
			}
		};

		// Update existing Patent
		$scope.update = function() {
			var patent = $scope.patent;

			patent.$update(function() {
				$location.path('patents/' + patent._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Patents
		$scope.find = function() {
			$scope.patents = Patents.query();
		};

		// Find existing Patent
		$scope.findOne = function() {
			$scope.patent = Patents.get({
				patentId: $stateParams.patentId
			});
		};

    // direct to show page
    $scope.listItemClick = function(patentId) {
    	location.href = '#!/patents/' + patentId;
    };

		$scope.getDueDate = function(month, year, day, month_offset, year_offset){
				var dueDateMonth = month + month_offset +1;
				var dueDateYear = year + year_offset;
				var dueDateDay = day + 1;

				if (dueDateMonth > 12) {
					dueDateMonth = dueDateMonth % 12;
					dueDateYear = dueDateYear + 1;
				}
				if (dueDateMonth < 10) {
					dueDateMonth = dueDateMonth.toString();
					dueDateMonth = '0' + dueDateMonth;
				}
				if (dueDateDay < 10) {
					dueDateDay = dueDateDay.toString();
					dueDateDay = '0' + dueDateDay;
				}
				dueDateYear = dueDateYear.toString();
				dueDateMonth = dueDateMonth.toString();
				dueDateDay = dueDateDay.toString();

				return dueDateYear + '-' + dueDateMonth + '-' + dueDateDay;
		};

		// once a statusDate is selected the due dates are 
		// automatically calculated depending on what status is selected
		$scope.calculateDueDates = function (selectedOption, toggle) {
			var that = this;
			var month, year, day;

			if (toggle === 'edit') {
				that = this.patent;
			}

			month = that.statusDate.getUTCMonth();
			year = that.statusDate.getUTCFullYear();
			day = that.statusDate.getUTCDate();

			switch(selectedOption) {
				case 0: // Provisional - 1 year
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 0, 1) ).toISOString();
					break;
				case 1: // notice to file missing parts - 2 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 2, 0) );
					break;
				case 2: // Restriction Requirement - 2 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 2, 0) );
					break;
				case 3: // office action - 3 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 3, 0) );
					break;
				case 4: // Extension 1 - 1 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 1, 0) );
					break;
				case 5: // Extension 2 - 1 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 1, 0) );
					break;
				case 6: // Extension 3 - 1 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 1, 0) );
					break;
				case 7: // NOA - 3 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 3, 0) );
					break;
				case 8: // issued - 3yr --> 7yr --> 11yr
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 0, 3) );
					that.secondDueDate = new Date( $scope.getDueDate(month, year, day, 0, 7) );
					that.thirdDueDate = new Date( $scope.getDueDate(month, year, day, 0, 11) ).toISOString();
					break;
				case 9: // Design - 14 yrs
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 0, 14) );
					break;
				case 10: // Utility - 20 yrs
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 0, 20) );
					break;
			}
		};
	}
]);

'use strict';

//Patents service used to communicate Patents REST endpoints
angular.module('patents').factory('Patents', ['$resource',
	function($resource) {
		return $resource('patents/:patentId', { patentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
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

// 'use strict';

// //Setting up route
// angular.module('trademarks').config(['$stateProvider',
// 	function($stateProvider) {
// 		// Trademarks state routing
// 		$stateProvider.
// 		state('listTrademarks', {
// 			url: '/trademarks',
// 			templateUrl: 'modules/trademarks/views/list-trademarks.client.view.html'
// 		}).
// 		state('createTrademark', {
// 			url: '/trademarks/create',
// 			templateUrl: 'modules/trademarks/views/create-trademark.client.view.html'
// 		}).
// 		state('viewTrademark', {
// 			url: '/trademarks/:trademarkId',
// 			templateUrl: 'modules/trademarks/views/view-trademark.client.view.html'
// 		}).
// 		state('editTrademark', {
// 			url: '/trademarks/:trademarkId/edit',
// 			templateUrl: 'modules/trademarks/views/edit-trademark.client.view.html'
// 		});
// 	}
// ]);

'use strict';

// Setting up route
angular.module('trademarks').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('app.listTrademarks', {
			url: '/trademarks',
			title: 'List Trademarks',
			templateUrl: 'modules/trademarks/views/list-trademarks.client.view.html'
		}).
		state('app.createTrademarks', {
			url: '/trademarks/create',
			title: 'New Trademarks',
			templateUrl: 'modules/trademarks/views/create-trademark.client.view.html'
		}).
		state('app.viewTrademarks', {
			url: '/trademarks/:trademarkId',
			title: 'View Trademarks',
			templateUrl: 'modules/trademarks/views/view-trademark.client.view.html',
			controller: 'TrademarksController'
		}).
		state('app.editTrademarks', {
			title: 'Edit Trademarks',
			url: '/trademarks/:trademarkId/edit',
			templateUrl: 'modules/trademarks/views/edit-trademark.client.view.html'
		});
	}
]);

'use strict';

// Trademarks controller
angular.module('trademarks').controller('TrademarksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Trademarks', '$http',
	function($scope, $stateParams, $location, Authentication, Trademarks, $http) {
		$scope.authentication = Authentication;

		$scope.statusOptions = [
			{id:0, name:'Pending'},
			{id:1, name:'Published'},
			{id:2, name:'NOA'},
			{id:3, name:'Notice of Abandonment'},
			{id:4, name:'Office Action'},
			{id:5, name:'Extension 1'},
			{id:6, name:'Extension 2'},
			{id:7, name:'Extension 3'},
			{id:8, name:'Extension 4'},
			{id:9, name:'Extension 5'},
			{id:10, name:'Registered'}
		];

		$scope.attorneys = [
			{id:0, name:'Pelaez'},
			{id:1, name:'Gabriel'},
			{id:2, name:'Cohen'}
		];

		// for search feature
		$scope.sortType     = 'owner';
		$scope.sortReverse  = false;
		$scope.searchTrademarks   = '';

		// Create new Trademark
		$scope.create = function() {
			// Create new Trademark object
			var trademark = new Trademarks ({
				owner							: this.owner,
				address						: this.address,
				mark							: this.mark,
				country						: this.country,
				ic								: this.ic,
				goodsAndServices	: this.goodsAndServices,
				filingDate				: this.filingDate,
				registrationDate	: this.registrationDate,
				applicationNumber	: this.applicationNumber,
				registrationNumber: this.registrationNumber,
				trademarkStatus		: this.trademarkStatus,
				statusDate				: this.statusDate,
				dueDate						: this.dueDate,
				secondDueDate			: this.secondDueDate,
				attorney					: this.attorney,
				comments					: this.comments
			});


			// Redirect after save
			trademark.$save(function(response) {
				$location.path('trademarks/' + response._id);

				// Clear form fields
				$scope.owner = '';
				$scope.address = '';
				$scope.mark = '';
				$scope.country = '';
				$scope.ic = '';
				$scope.goodsAndServices = '';
				$scope.filingDate = '';
				$scope.registrationDate = '';
				$scope.applicationNumber = '';
				$scope.registrationNumber = '';
				$scope.trademarkStatus = '';
				$scope.statusDate = '';
				$scope.dueDate = '';
				$scope.secondDueDate = '';
				$scope.attorney = '';
				$scope.comments = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Trademark
		$scope.remove = function(trademark) {
			var conf = confirm('Are you sure?');
			if (conf === true) {
				if ( trademark ) {
					trademark.$remove();

					for (var i in $scope.trademarks) {
						if ($scope.trademarks [i] === trademark) {
							$scope.trademarks.splice(i, 1);
						}
					}
				} else {
					$scope.trademark.$remove(function() {
						$location.path('trademarks');
					});
				}
			}
		};

		// Update existing Trademark
		$scope.update = function() {
			var trademark = $scope.trademark;

			trademark.$update(function() {
				$location.path('trademarks/' + trademark._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Trademarks
		$scope.find = function() {
			$scope.trademarks = Trademarks.query();
		};

		// Find existing Trademark
		$scope.findOne = function() {
			$scope.trademark = Trademarks.get({
				trademarkId: $stateParams.trademarkId
			});
		};

		// direct to show page
		$scope.listItemClick = function(trademarkId) {
			location.href = '#!/trademarks/' + trademarkId;
		};

		$scope.getDueDate = function(month, year, day, month_offset, year_offset){
			var dueDateMonth = month + month_offset + 1;
			var dueDateYear = year + year_offset;
			var dueDateDay = day + 1;

			if (dueDateMonth > 12) {
				dueDateMonth = dueDateMonth % 12;
				dueDateYear = dueDateYear + 1;
			}
			if (dueDateMonth < 10) {
				dueDateMonth = dueDateMonth.toString();
				dueDateMonth = '0' + dueDateMonth;
			}
			if (dueDateDay < 10) {
				dueDateDay = dueDateDay.toString();
				dueDateDay = '0' + dueDateDay;
			}
			dueDateYear = dueDateYear.toString();
			dueDateMonth = dueDateMonth.toString();
			dueDateDay = dueDateDay.toString();

			return dueDateYear + '-' + dueDateMonth + '-' + dueDateDay;
		};

		// once a statusDate is selected the due dates are 
		// automatically calculated depending on what status is selected
		$scope.calculateDueDates = function ( selectedOption, toggle ) {
			var that = this;
			var month, year, day;

			if (toggle === 'edit') {
				that = this.trademark;
			}

			month = $scope.statusDate.getUTCMonth();
			year = $scope.statusDate.getUTCFullYear();
			day = $scope.statusDate.getUTCDate();	

			switch( selectedOption ) {
				case 0: // Pending - 6 mo
				// console.log(new Date($scope.getDueDate(month, year, day, 6, 0)));
					that.dueDate = new Date($scope.getDueDate(month, year, day, 6, 0));
					break;
				case 1: // Published - 6 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 6, 0) );
					break;
				case 2: // NOA - 6 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 6, 0) );
					break;
				case 3: // Notice of Abandonment - 2 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 2, 0) );
					break;
				case 4: // Office Action - 6 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 6, 0) );
					break;
				case 5: // Extension 1 - 6 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 6, 0) );
					break;
				case 6: // Extension 2 - 6 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 6, 0) );
					break;
				case 7: // Extension 3 - 6 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 6, 0) );
					break;
				case 8: // Extension 4 - 6 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 6, 0) );
					break;
				case 9: // Extension 5 - 6 mo
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 6, 0) );
					break;
				default: // Registration Date - 5 yrs --> 10 yrs
					that.dueDate = new Date( $scope.getDueDate(month, year, day, 0, 5) );
					that.secondDueDate = new Date( $scope.getDueDate(month, year, day, 0, 10) );
			}
		};

$scope.connectToUspto = function ( appNumber ) {
	// alert(appNumber);
		var that = this;
    var yql_url = 'https://query.yahooapis.com/v1/public/yql';
    var url = 'https://tsdrapi.uspto.gov/ts/cd/casestatus/sn' + appNumber + '/info.json';

    $.ajax({
      'url': yql_url,
      'data': {
        'q': 'SELECT * FROM json WHERE url="'+url+'"',
        'format': 'json',
        'jsonCompat': 'new',
      },
      'dataType': 'jsonp',
      'success': function(response) {
   console.log(response);
      	var usptoData = response.query.results.json.trademarks[0],
      		fd = usptoData.status.filingDate,
      		icCodes = '',
      		gsListValues = '';

      	fd = fd.split('-');
				$scope.owner = owner.value = usptoData.parties.ownerGroups[10][0].name;
				$scope.address = address.value = usptoData.parties.ownerGroups[10][0].address1;
				$scope.mark = mark.value = usptoData.status.markElement;
				$scope.country = country.value = usptoData.parties.ownerGroups[10][0].addressStateCountry.iso.code;		

for (var i = 0; i < usptoData.gsList.length ; i++) {
	
	if ( i == 0 ) {

		icCodes = icCodes + usptoData.gsList[i].internationalClasses[0].code ;

		gsListValues = gsListValues + usptoData.gsList[i].description;

	} else {

		icCodes = icCodes + ', ' + usptoData.gsList[i].internationalClasses[0].code ;

		gsListValues = gsListValues + '\n' + usptoData.gsList[i].description;

	}

}

				// $scope.ic = ic.value = usptoData.gsList[0].internationalClasses[0].code;
				$scope.ic = ic.value = icCodes;
				
				// $scope.goodsAndServices = goodsandservices.value = usptoData.gsList[0].description;
				$scope.goodsAndServices = goodsandservices.value = gsListValues;

				$scope.filingDate = new Date(usptoData.status.filingDate);

				filingdate.value = usptoData.status.filingDate;
				$scope.registrationDate = new Date(usptoData.status.usRegistrationDate);
				registrationdate.value = usptoData.status.usRegistrationDate;
				$scope.applicationNumber = applicationnumber.value = appNumber;
				$scope.registrationNumber = registrationnumber.value = usptoData.status.usRegistrationNumber;
				$scope.statusDate = new Date(usptoData.status.statusDate);
				statusdate.value = usptoData.status.statusDate;

      },
    });
};


	}
]);

'use strict';

//Trademarks service used to communicate Trademarks REST endpoints
angular.module('trademarks').factory('Trademarks', ['$resource',
	function($resource) {
		return $resource('trademarks/:trademarkId', { trademarkId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('page.signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('page.signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('page.forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('page.reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('page.reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('page.reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		}).
		state('app.password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('app.profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('app.accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);