(function(){
  'use strict';
  angular.module('learnerApp')
  .factory('User', ['$resource', function($resource) {
    var User = $resource('/api/users/:_id', {
      _id: '@id'
    }, {
      update: {
        method: 'PUT', // this method issues a PUT request,
        isArray: false
      }
    });
    //add is admin
    User.prototype.isAdmin = function() {
      return this.roles && this.roles.indexOf('admin') > -1;
    };
    return User;
  }]);
})();
