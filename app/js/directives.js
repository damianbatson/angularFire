'use strict';

/* Directives */


angular.module('myApp.directives', [])
.directive('loginDir', function() {
	return {
		restrict: 'E',
		scope: {
			email: '@emailattr',
			pass: '=passattr',
			login: '&loginattr'
			},
			
		templateUrl:'partials/logintemplate.html',
		
		
		link: function ($scope, $element, $attrs){
			
		},
		controller: 'LoginCtrl'
	};
});
