'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'waitForAuth', 'firebase', 'ngRoute'])

   // double-check that the app has been configured
   .run(['loginService', '$rootScope', function(loginService, $rootScope) {
      
         // establish authentication
         $rootScope.auth = loginService.init('/login');
         //$rootScope.FBURL = FBURL;
      
   }])

   // configure views; note the authRequired parameter for authenticated pages
   .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/home', {
         templateUrl: 'partials/home.html',
         controller: 'HomeCtrl'
      });

      $routeProvider.when('/chat', {
         templateUrl: 'partials/chat.html',
         controller: 'ChatCtrl'
      });

      $routeProvider.when('/account', {
         authRequired: true, // must authenticate before viewing this page
         templateUrl: 'partials/account.html',
         controller: 'AccountCtrl'
      });

      $routeProvider.when('/login', {
         templateUrl: 'partials/login.html',
         controller: 'LoginCtrl'
      });
  
       $routeProvider.when('/create', {
         templateUrl: 'partials/create.html',
         controller: 'CreateCtrl'
      });

      $routeProvider.otherwise({redirectTo: '/home'});
   }])
