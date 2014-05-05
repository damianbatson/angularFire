'use strict';

/**
 * This module monitors angularFire's authentication and performs actions based on authentication state.
 * directives/directive.ngcloakauth.js depends on this file
 *
 * Modify ng-cloak to hide content until FirebaseSimpleLogin resolves. Also
 * provides ng-show-auth methods for displaying content only when certain login
 * states are active.
 *
 * Just like other ng-cloak ops, this works best if you put the following into your CSS:
 [ng\:cloak], [ng-cloak], [data-ng-cloak], [i-ng-cloak], .ng-cloak, .i-ng-cloak {
        display: none !important;
   }
 *
 * See usage examples here: https://gist.github.com/katowulf/7328023
 */
angular.module('waitForAuth', [])

/**
 * A service that returns a promise object, which is resolved once $firebaseSimpleLogin
 * is initialized.
 *
 * <code>
 *    function(waitForAuth) {
 *        waitForAuth.then(function() {
 *            console.log('auth initialized');
 *        });
 *    }
 * </code>
 */
  .service('waitForAuth', function($rootScope, $q, $timeout) {
      var def = $q.defer(),
      subs = [];

      subs.push($rootScope.$on('$firebaseSimpleLogin:login', fn));
      subs.push($rootScope.$on('$firebaseSimpleLogin:logout', fn));
      subs.push($rootScope.$on('$firebaseSimpleLogin:error', fn));
      
      function fn(err) {
         if( $rootScope.auth ) {
            $rootScope.auth.error = err instanceof Error? err.toString() : null;
         }
         for(var i=0; i < subs.length; i++) {
          subs[i]();
         }
         $timeout(function() {
            // force $scope.$apply to be re-run after login resolves
            def.resolve();
         });
      }
      return def.promise;
   })

.directive('ngCloakAuth', function(waitForAuth) {
      return {
         restrict: 'A',
         compile: function(el) {
            el.addClass('hide');
            waitForAuth.then(function() {
               el.removeClass('hide');
               console.log('cloak');
            }, function(error){

            });
         }
      };
   });