
angular.module('myApp.service.login', [])

   .factory('loginService', ['$rootScope', '$firebaseSimpleLogin', '$timeout',
      function($rootScope, $firebaseSimpleLogin, $timeout) {
         var auth = null;
         return {

            init: function() {
              var firebaseRef = new Firebase("https://prototype-firebase.firebaseio.com");
               return auth = $firebaseSimpleLogin(firebaseRef);
            },

            /**
             * @param {string} email
             * @param {string} pass
             * @param {Function} [callback]
             * @returns {*}
             */
            login: function(email, pass, callback) {
              assertAuth();
              var error = null;
              auth.$login('password', {email: email, password: pass, rememberMe: true}).then(function(user) {
                //if (!error) {
                  callback(null, user);
                  console.log('loggedin successfully');
                //}
              }, function(error){
                console.error('Unable to login', error);
              });
            },

            logout: function() {
               assertAuth();
               auth.$logout();
            },

            changePassword: function(opts) {
               assertAuth();
               var error = null;
               var callback = opts.callback || function() {};
               if( !opts.oldpass || !opts.newpass ) {
                  $timeout(function(){
                   callback('Please enter a password');
                 });
               }
               else if( opts.newpass !== opts.confirm ) {
                  $timeout(function() {
                    callback('Passwords do not match');
                  });
               }
               else {
                  auth.$changePassword(opts.email, opts.oldpass, opts.newpass).then(function(user) {
                    callback(user);
                    console.log('password changed successfully');
                  }, function(error){
                    console.error('Unable to login', error);
                });
               }
            },

            createUserAccount: function(email, pass, callback) {
               assertAuth();
               var error = null;
               auth.$createUser(email, pass).then(function(user) {
                  //if (!error) {
                    callback(user);
                    console.log('user created successfully');
                  //}
               }, function(error){
                console.error('Unable to createUserAccount', error);
               });
            },

            //createProfile: profileCreator
         };

         function assertAuth() {
            if( auth === null ) { throw new Error('Must call loginService.init() before using its methods'); }
         }
      }])

   .factory('profileData', ['$timeout', function( $timeout) {
          return {
            setData: function(id, email, callback) {
              
              //return auth = $firebaseSimpleLogin(firebaseRef);
                var firebaseRef = new Firebase("https://prototype-firebase.firebaseio.com"+"/users/"+id).set({email: email}, function(user){
                  if (callback) {
                    $timeout(function(){
                      callback(user);
                    });
                  }

                });
    
             }

          };
      }]);
