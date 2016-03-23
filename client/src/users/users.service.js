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
    User.prototype.hasRole = function(roleName) {
      if(!this.roles || this.roles.length<=0) return false;
      for (var i = 0; i < this.roles.length; i++) {
        if(this.roles[i].name === roleName)
        {
          return true;
        }
      }
      return false;
    };

    User.prototype.isAdmin = function() {
      return this.hasRole('admin');
    };
    User.prototype.isSuperAdmin = function() {
      return this.hasRole('superadmin');
    };
    return User;
  }]);
})();
