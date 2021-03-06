(function(){
  'use strict';
  angular.module('learnerApp')
  .factory('Lecturer', ['$resource','APIBASEURL', 'Helpers', function($resource, APIBASEURL, Helpers) {
    var Lecturer = $resource( APIBASEURL+'/lecturers/:id/:controller', {
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
    return Lecturer;
  }]);
})();
