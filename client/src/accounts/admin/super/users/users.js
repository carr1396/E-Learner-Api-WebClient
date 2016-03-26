(function() {
  'use strict';
  angular.module('leanerAdminSuperUserModule', [])
      .controller('UsersCtrl', [
        '$scope',
        '$stateParams',
        'Toastr',
        'User',
        'Role',
        function($scope, $stateParams, Toastr, User, Role) {
          $scope.title = 'Users';
          $scope.roles = [];
          $scope.user =
              {'roles' : [], 'rolesCheckModel' : [], 'rolesCheckModelOut' : []};
          $scope.generateRoles = function Roles() {
            Role.query().$promise.then(
                function(res) {
                  $scope.roles = res;
                  $scope.user.rolesCheckModel =
                      $scope.generateRolesCheckModel();
                },
                function(err) { Toast.error('Problem Fetching Roles'); });
          };
          $scope.generateRolesCheckModel = function generateRolesCheckModel() {
            var i = 0;
            var len = $scope.roles.length;
            var roles = [];
            for (; i < len; i++) {
              var p = $scope.roles[i];
              roles.push({
                id : p.id,
                name : p.name,
                displayName : p.displayName(),
                checked : false
              });
              $scope.user.roles.forEach(function(p2) {
                if (p2.id === p.id) {
                  roles[i].checked = true;
                }
              });
            }
            return roles;
          };
          if ($stateParams.userId) {
            $scope.user = angular.extend(User.get({id : $stateParams.userId}),
                                         $scope.user);
            $scope.user.$promise.then(function(res) { $scope.generateRoles(); },
                                      function(err) {});
          }
          $scope.users = User.query();
          $scope.ifUserExists = function(user) {
            if (user.hasOwnProperty('id')) {
              return true;
            }
            return false;
          };
          function displayErrors(err) {
            $scope.errors = [];
            $scope.messages = [];
            if (err.statusText) {
              $scope.errors.push(err.statusText);
            }
            if (err.message) {
              $scope.errors.push(err.message);
            }
            if (err.data) {
              if (err.data.error) {
                $scope.errors.push(err.data.error);
              }
              if (err.data.errors) {
                err.data.errors.forEach(function(e) { $scope.push(e); });
              }
            }
            if (err.error) {
              if (err.error) {
                $scope.errors.push(err.error);
              }
              if (err.errors) {
                err.errors.forEach(function(e) { $scope.errors.push(e); });
              }
            }
            var error = '<ul class="list">';
            $scope.errors.forEach(function(err) {
              error += '<li> ' + err + ' </li>';
            });
            error += '</ul>';
            Toastr.error(error);
          }
          $scope.deleteThisUser = function deleteThisUser(user, pos) {
            var deleteConfirmed = confirm('Are You Sure Want To Delete "' +
                                          user.displayName() + '" User');
            if (deleteConfirmed) {
              user.$delete();
              $scope.users.splice(pos, 1);
            }
          };
          $scope.createOrEdit = function submitCreateOrEditForm(form, r) {
            if (form.$valid) {
              if ($scope.ifUserExists(r)) {
                $scope.user.$update().then(
                    function(res) {
                      if (!res.id) {
                        if (!res.data || !res.data.user) {
                          if (!res.error && !res.success) {
                            Toastr.error("Server Error! Something Went Wrong");
                          }
                        }
                        if (!res.success || res.error) {
                          displayErrors(res);
                        }
                      } else {
                        for (var i = 0; i < $scope.users.length; i++) {
                          if ($scope.users[i].id === $scope.user.id) {
                            $scope.users[i] = $scope.user;
                            $scope.user.rolesCheckModel =
                                $scope.generateRolesCheckModel();
                            break;
                          }
                        }
                      }
                      Toastr.success('Success!!', 'User  ' +
                                                      $scope.user.username +
                                                      ' Has Been Updated');
                    },
                    function(err) { displayErrors(err); });
              }
            } else {
              $scope.errors = [];
              $scope.messages = [];
              $scope.errors.push(
                  'Form Submitted Is Invalid Please Fill In All The Fields Correctly');
              var error = '<ul class="list">';
              $scope.errors.forEach(function(err) {
                error += '<li>' + err + '</li>';
              });
              error += '</ul>';
              Toastr.error(error);
            }
          };
        }
      ]);
})();
