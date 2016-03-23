(function() {
  'use strict';
  angular.module('learnerApp')
  .factory('Role', ['$resource','APIBASEURL', 'Helpers', function($resource, APIBASEURL, Helpers) {
    var Role = $resource( APIBASEURL+'/roles/:id', {
      id: '@id'
    }, {
      update: {
        method: 'PUT', // this method issues a PUT request,
        isArray: false
      }
    });
    
    Role.prototype.displayName = function() {
      return this.name ? Helpers.capitalizeFirstLetter(this.name):null;
    };
    return Role;
  }]);

})();
