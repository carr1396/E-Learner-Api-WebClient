(function(){
  'use strict';
  angular.module('learnerApp')
  .factory('Category', ['$resource','APIBASEURL', 'Helpers', function($resource, APIBASEURL, Helpers) {
    var Category = $resource( APIBASEURL+'/categories/:id/:controller', {
      id: '@id'
    }, {
      update: {
        method: 'PUT', // this method issues a PUT request,
        isArray: false
      },
      lists: {
        method: 'GET',
        isArray: true,
        params: {
          id: 'list'
        }
      }
    });
    return Category;
  }]);
})();
