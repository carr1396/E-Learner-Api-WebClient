(function(){
  'use strict';
  angular.module('learnerApp')
  .factory('School', ['$resource','APIBASEURL', 'Helpers', function($resource, APIBASEURL, Helpers) {
    var School = $resource( APIBASEURL+'/schools/:id/:controller', {
      id: '@id'
    }, {
      update: {
        method: 'PUT', // this method issues a PUT request,
        isArray: false
      },
      
      // changePassword: {
      //   method: 'PUT',
      //   params: {
      //     controller: 'password'
      //   }
      // },
      mine: {
        method: 'GET',
        isArray: true,
        params: {
          id: 'me'
        }
      },
      available: {
        method: 'GET',
        isArray: true,
        params: {
          id: 'public'
        }
      },
      subscriptions: {
        method: 'GET',
        isArray: true,
        params: {
          id: 'me'
        }
      }
    });
    return School;
  }]);
})();
