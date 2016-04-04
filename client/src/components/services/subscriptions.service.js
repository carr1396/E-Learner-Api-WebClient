(function(){
  'use strict';
  angular.module('learnerApp')
  .factory('Subscription', ['$resource','APIBASEURL', 'Helpers', function($resource, APIBASEURL, Helpers) {
    var Subscription = $resource( APIBASEURL+'/subscriptions/:id/:controller', {
      id: '@id'
    }, {
      update: {
        method: 'PUT', // this method issues a PUT request,
        isArray: false
      }
    });
    return Subscription;
  }]);
})();
