'use strict';

/* Directives */


angular.module('myApp.directives', [])
.directive('loginDir', function() {
	return {
		restrict: 'E',
		scope: {
			email: '@',
			pass: '=',
			login: '&'
			},
			
		templateUrl:'partials/logintemplate.html',
		
		
		link: function ($scope, $element, $attrs){
			
		},
		controller: 'LoginCtrl'
	};
})

// .directive('inputDir', function() {
//   return {
//     restrict: 'E',
//     scope: {
//       exonemachine: '=userattr'
//       },
      
//     templateUrl:'partials/accounttemplate.html',
    
    
//     link: function ($scope, $element, $attrs){
      
//     },
//     controller: 'AccountCtrl'
//   };
// })



/**
 * A directive that shows elements only when the given authentication state is in effect
 *
 * <code>
 *    <div ng-show-auth="login">{{auth.user.id}} is logged in</div>
 *    <div ng-show-auth="logout">Logged out</div>
 *    <div ng-show-auth="error">An error occurred: {{auth.error}}</div>
 *    <div ng-show-auth="logout,error">This appears for logout or for error condition!</div>
 * </code>
 */
 .directive('ngShowAuth', ['loginService', '$timeout', function (loginService, $timeout) {
    var isLoggedIn;
    loginService.watch(function(user) {
      isLoggedIn = !!user;
    });

    return {
      restrict: 'A',
      link: function(scope, el) {
        el.addClass('ng-cloak'); // hide until we process it

        function update() {
          // sometimes if ngCloak exists on same element, they argue, so make sure that
          // this one always runs last for reliability
          $timeout(function () {
            el.toggleClass('ng-cloak', !isLoggedIn);
          }, 0);
        }

        update();
        loginService.watch(update, scope);
      }
    };
  }])

  /**
   * A directive that shows elements only when user is logged out.
   */
  .directive('ngHideAuth', ['loginService', '$timeout', function (loginService, $timeout) {
    var isLoggedIn;
    loginService.watch(function(user) {
      isLoggedIn = !!user;
    });

    return {
      restrict: 'A',
      link: function(scope, el) {
        function update() {
          el.addClass('ng-cloak'); // hide until we process it

          // sometimes if ngCloak exists on same element, they argue, so make sure that
          // this one always runs last for reliability
          $timeout(function () {
            el.toggleClass('ng-cloak', isLoggedIn !== false);
          }, 0);
        }

        update();
        loginService.watch(update, scope);
      }
    };
  }]);