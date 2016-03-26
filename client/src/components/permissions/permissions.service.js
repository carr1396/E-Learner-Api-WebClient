(function() {
  'use strict';
  angular.module('learnerApp')
  .factory('Permission', ['$resource','APIBASEURL', 'Helpers', function($resource, APIBASEURL, Helpers) {
    var Permission = $resource( APIBASEURL+'/permissions/:id', {
      id: '@id'
    }, {
      update: {
        method: 'PUT', // this method issues a PUT request,
        isArray: false
      }
    });

    Permission.prototype.displayName = function() {
      return this.name ? Helpers.capitalizeFirstLetter(this.name):null;
    };
    return Permission;
  }]);

})();
