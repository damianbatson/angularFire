
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
             * @param {Function} [promise]
             * @returns {*}
             */
            login: function(email, pass, promise) {
              //assertAuth();
              var error = null;
              auth.$login('password', {email: email, password: pass, rememberMe: true}).then(function(user) {
                //if (!error) {
                  promise(null, user);
                  console.log('loggedin successfully');
                //}
              }, function(error){
                console.error('Unable to login', error);
              });
            },

            logout: function() {
               //assertAuth();
               auth.$logout();
            },

            changePassword: function(opts) {
               //assertAuth();
               var error = null;
               var promise = opts.callback || function() {};
               if( !opts.oldpass || !opts.newpass ) {
                  $timeout(function(){
                   promise('Please enter a password');
                 });
               }
               else if( opts.newpass !== opts.confirm ) {
                  $timeout(function() {
                    promise('Passwords do not match');
                  });
               }
               else {
                  auth.$changePassword(opts.email, opts.oldpass, opts.newpass).then(function(user) {
                    promise(user);
                    console.log('password changed successfully');
                  }, function(error){
                    console.error('Unable to change', error);
                });
               }
            },

            createUserAccount: function(email, pass, promise) {
               //assertAuth();
               var error = null;
               auth.$createUser(email, pass).then(function(user) {
                  //if (!error) {
                    promise(user);
                    console.log('user created successfully');
                  //}
               }, function(error){
                console.error('Unable to createUserAccount', error);
               });
            },

            getUser: function() {
          
        },

            //createProfile: profileCreator
            watch: function(cb, $scope) {
          return auth.$getCurrentUser().then(function(user) {
            cb(user);
          });
          listeners.push(cb);
          var unbind = function() {
            var i = listeners.indexOf(cb);
            if( i > -1 ) { listeners.splice(i, 1); }
          };
          if( $scope ) {
            $scope.$on('$destroy', unbind);
          }
          return unbind;
        }
      
         };


         
      }])

   .factory('profileData', ['$timeout', '$firebase', function($timeout, $firebase) {
          return {
            setData: function(user, email, promise) {
              
              var firebaseRef = new Firebase("https://prototype-firebase.firebaseio.com/users/"+user);
              var auth = $firebase(firebaseRef);
              auth.$set({email: email}, function(user){
                if (promise) {
                  $timeout(function(){
                    promise(user);
                  });
                }

              });
    
            }

        };
      }]);
