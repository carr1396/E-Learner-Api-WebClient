(function(){
  'use strict';
  angular.module('learnerApp')
  .factory('Course', ['$resource','APIBASEURL', 'Helpers', function($resource, APIBASEURL, Helpers) {
    var Course = $resource( APIBASEURL+'/courses/:id/:controller', {
      id: '@id'
    }, {
      update: {
        method: 'PUT', // this method issues a PUT request,
        isArray: false
      },
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
    return Course;
  }]);
})();
