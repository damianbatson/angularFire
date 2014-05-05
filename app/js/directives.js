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
})

.directive('inputDir', function() {
  return {
    restrict: 'E',
    scope: {
      exonemachine: '=userattr'
      },
      
    templateUrl:'partials/accounttemplate.html',
    
    
    link: function ($scope, $element, $attrs){
      
    },
    controller: 'AccountCtrl'
  };
})



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
 .directive('ngShowAuth', function ($rootScope) {
    var loginState;
    $rootScope.$on('$firebaseSimpleLogin:login',  function() { loginState = 'login'; });
    $rootScope.$on('$firebaseSimpleLogin:logout', function() { loginState = 'logout'; });
    $rootScope.$on('$firebaseSimpleLogin:error',  function() { loginState = 'error'; });

    function inList(loginState, list) {
      var result = false;
      angular.forEach(list, function(i) {
        if( i === loginState ) {
          result = true;
        }
      });
      return result;
    }

    function assertValidState(state) {
         if( !state ) {
            throw new Error('ng-show-auth directive must be login, logout, or error (you may use a comma-separated list)');
         }
         var states = (state||'').split(',');
         angular.forEach(states, function(s) {
            if( !inList(s, ['login', 'logout', 'error']) ) {
               throw new Error('Invalid state "'+s+'" for ng-show-auth directive, must be one of login, logout, or error');
            }
         });
         return true;
      console.log('assertValidStates');
    }

    return {
      
         restrict: 'A',
         compile: function(el, attr) {
            assertValidState(attr.ngShowAuth);
            var expState = (attr.ngShowAuth||'').split(',');
            function fn(loginState) {
               //loginState = newState;
               var hide = !inList(loginState, expState);
               el.toggleClass('hide', hide);
            }
            fn(loginState);
            $rootScope.$on("$firebaseSimpleLogin:login",  function() { fn('login') });
            $rootScope.$on("$firebaseSimpleLogin:logout", function() { fn('logout') });
            $rootScope.$on("$firebaseSimpleLogin:error",  function() { fn('error') });
         }
    };
  });