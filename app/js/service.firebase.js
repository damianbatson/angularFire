
angular.module('myApp.service.firebase', [])

// a simple utility to create references to Firebase paths
   .factory('firebaseRef', [ 'FBURL', function( FBURL) {
      /**
       * @function
       * @name firebaseRef
       * @param {String|Array...} path
       * @return a Firebase instance
       */

       function pathRef(args) {
           for(var i=0; i < args.length; i++) {
              if( typeof(args[i]) === 'object' ) {
                 args[i] = pathRef(args[i]);
              }
           }
           return args.join('/');
        }

      return function(path) {
         return new Firebase(pathRef([FBURL].concat(Array.prototype.slice.call(arguments))));
      };
   }])

   // a simple utility to create $firebase objects from angularFire
   .service('syncData', ['$firebase', 'firebaseRef', function($firebase, firebaseRef) {
      /**
       * @function
       * @name syncData
       * @param {String|Array...} path
       * @param {int} [limit]
       * @return a Firebase instance
       */
      return function(path, limit) {
         var ref = firebaseRef(path);
         limit && (ref = ref.limit(limit));
         console.log('sync');
         return $firebase(ref);

      };
   }]);

