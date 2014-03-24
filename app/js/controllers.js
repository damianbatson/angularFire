'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

   .controller('HomeCtrl', ['$scope', '$firebase', function($scope, $firebase) {
      //syncData('syncedValue').$bind($scope, 'syncedValue');
   }])

  .controller('ChatCtrl', ['$scope', '$firebase', function($scope, $firebase) {
      $scope.newMessage = null;

      // constrain number of messages by limit into syncData
      // add the array into $scope.messages
      $scope.messages = $firebase (new Firebase("https://prototype-firebase.firebaseio.com" + "/messages/"));
               //return auth = $firebaseSimpleLogin(firebaseRef);

      // add new messages to the list
      $scope.addMessage = function() {
         if( $scope.newMessage ) {
            $scope.messages.$add({text: $scope.newMessage});
            $scope.newMessage = null;
         }
      };
   }])

   .controller('LoginCtrl', ['$scope', 'loginService', '$location', function($scope, loginService, $location) {
      $scope.email = null;
      $scope.pass = null;
      $scope.name = null;
      $scope.confirm = null;
      $scope.createMode = false;

      $scope.login = function() {
         $scope.err = null;
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else {
            loginService.login($scope.email, $scope.pass, function(user) {
               
               $location.path('/account');
               console.log('logged in');
               
            });
         }
      };
   }])

	.controller('CreateCtrl', ['$scope', 'loginService', 'profileData', '$location', function($scope, loginService, profileData, $location) {
      $scope.createUserAccount = function() {
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else if( $scope.pass !== $scope.confirm ) {
            $scope.err = 'Passwords do not match';
         }
         else {
            loginService.createUserAccount($scope.email, $scope.pass, function(user) {

               profileData.setData(user.uid, user.email);
               $location.path('/account');
               console.log('data set');

            });
         }
      };
  
   }])

   .controller('AccountCtrl', ['$scope', 'loginService', '$firebase', '$location', function($scope, loginService, $firebase, $location) {
      //$scope.syncAccount = function() {
       //  $scope.user = {};
       //  syncData(['users', $scope.auth.user.uid]).$bind($scope, 'user').then(function(unBind) {
       //     $scope.unBindAccount = unBind;
       //     console.log('account sync');
      //   });
      //};

      $scope.syncAccount = function() {
        $firebase(new Firebase("https://prototype-firebase.firebaseio.com" +'/users/'+$scope.auth.user.uid)).$bind($scope, 'user').then(function(unBind) {
            $scope.unBindAccount = unBind;
            console.log('account sync');
         });
      };

      $scope.syncAccount();

      $scope.logout = function() {
         loginService.logout();
         $location.path('/chat');
      };

      $scope.oldpass = null;
      $scope.newpass = null;
      $scope.confirm = null;

      $scope.reset = function() {
         $scope.err = null;
         $scope.msg = null;
      };

      $scope.updatePassword = function() {
         $scope.reset();
         loginService.changePassword(buildPwdParms());
      };

      function buildPwdParms() {
         return {
            email: $scope.auth.user.email,
            oldpass: $scope.oldpass,
            newpass: $scope.newpass,
            confirm: $scope.confirm,
            callback: function(err) {
               if( err ) {
                  $scope.err = err;
               }
               else {
                  $scope.oldpass = null;
                  $scope.newpass = null;
                  $scope.confirm = null;
                  $scope.msg = 'Password updated!';
               }
            }
         };
      }

   }]);