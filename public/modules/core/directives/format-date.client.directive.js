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
