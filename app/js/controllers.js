'use strict';

/* Controllers */

angular.module('myApp.controllers', ['firebase.utils'])

   .controller('HomeCtrl', ['$scope', '$firebase', function($scope, $firebase) {
      //syncData('syncedValue').$bind($scope, 'syncedValue');
   }])

  .controller('ChatCtrl', ['$scope', '$firebase', 'Firebase', 'profileData', function($scope, $firebase, Firebase, profileData) {
      
      var messagesRef = new Firebase("https://prototype-firebase.firebaseio.com/messages/");
      $scope.messages = $firebase(messagesRef);
      $scope.newMessage = null;
      $scope.addMessage = function() {

         if( $scope.newMessage ) {
            $scope.messages.$add({
               text:$scope.newMessage,
               exer:$scope.newExer01
            });
            $scope.newMessage = null;
         }
         //profileData.addData($scope.newMessage);
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
            loginService.createUserAccount($scope.email, $scope.pass, function(user, uid, email) {

               profileData.setData($scope.auth.user.uid,$scope.auth.user.email);
               $location.path('/account');
               console.log('data set');

            });
         }
      };
  
   }])

   .controller('AccountCtrl', ['$scope', 'loginService', 'fbutil', '$firebase', '$location', 'Firebase', 
      function($scope, loginService, fbutil, $firebase, $location, Firebase) {
      var syncRef = new Firebase("https://prototype-firebase.firebaseio.com/users/"+$scope.auth.user.uid);
      $scope.sync = $firebase(syncRef);

      $scope.syncAccount = function() {
         $scope.sync.$bind($scope, 'user').then(function(unBind) {
            $scope.unBindAccount = unBind;
            console.log('account sync');
         });
      };

      $scope.syncAccount();
      var user = $scope.auth.user.uid;

      var messagesRef = new Firebase("https://prototype-firebase.firebaseio.com/messages/"+user);
      $scope.messages = $firebase(messagesRef);
      // var usersRef = new Firebase("https://prototype-firebase.firebaseio.com/users/");
      // $scope.users = $firebase(usersRef);
      $scope.newMessage = null;
      
      $scope.addMessage = function() {

            $scope.messages.$add({text:$scope.newMessage});
            

      };      

      $scope.logout = function() {
         loginService.logout();
         $location.path('/login');
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