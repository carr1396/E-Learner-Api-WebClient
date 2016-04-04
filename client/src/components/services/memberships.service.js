(function(){
  'use strict';
  angular.module('learnerApp')
  .factory('Membership', ['$resource','APIBASEURL', 'Helpers', function($resource, APIBASEURL, Helpers) {
    var Membership = $resource( APIBASEURL+'/memberships/:id/:controller', {
      id: '@id'
    }, {
      update: {
        method: 'PUT', // this method issues a PUT request,
        isArray: false
      }
    });
    return Membership;
  }]);
})();
