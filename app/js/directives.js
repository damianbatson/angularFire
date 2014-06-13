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
.directive('ngShowAuth', ['$rootScope', function ($rootScope) {
    var loginState;
    $rootScope.$on('$firebaseSimpleLogin:login',  function() { loginState = 'login'; });
    $rootScope.$on('$firebaseSimpleLogin:logout', function() { loginState = 'logout'; });
    $rootScope.$on('$firebaseSimpleLogin:error',  function() { loginState = 'error'; });

    function getExpectedState(scope, attr) {
      var expState = scope.$eval(attr);
      if( typeof(expState) !== 'string' && !angular.isArray(expState) ) {
        expState = attr;
      }
      if( typeof(expState) === 'string' ) {
        expState = expState.split(',');
      }
      return expState;
    }

      function getLoginState(loginState, list) {
      var result;
      angular.forEach(list, function(i) {
        if( i === loginState ) {
          result = true;
        }
      });
      return result;
      }

      function assertValidState(states) {
      
        if( !states.length ) {
          throw new Error('ng-show-auth directive must be login, logout, or error (you may use a comma-separated list)');
        }
        
        angular.forEach(states, function(i) {
          if( !getLoginState(i, ['login', 'logout', 'error']) ) {
            throw new Error('Invalid state "'+i+'" for ng-show-auth directive, must be one of login, logout, or error');
          }
        });
        return states;
        
      }

    return {
      
        restrict: 'A',
        link: function(scope, el, attr) {
          var expStates = getExpectedState(scope, attr.ngShowAuth);
          assertValidState(expStates);
        
          
            
          function fn() {
            
            var show = getLoginState(loginState, expStates);
            el.toggleClass('ng-cloak', !show);
          }
            
          fn();

          $rootScope.$on("$firebaseSimpleLogin:login", fn);
          $rootScope.$on("$firebaseSimpleLogin:logout", fn);
          $rootScope.$on("$firebaseSimpleLogin:error", fn);
        }
    };
  }]);