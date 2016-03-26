(function() {
  'use strict';
  angular.module('leanerAdminSuperRoleModule', [])
      .controller('RolesCtrl', [
        '$scope',
        '$stateParams',
        'Toastr',
        'Role',
        'Permission',
        'Authentication',
        function($scope, $stateParams, Toastr, Role, Permission,
                 Authentication) {
          $scope.title = 'Roles';
          $scope.role = {permissions : [], permissionsOut : []};
          $scope.role.permissionsInModel = [];
          $scope.permissions = [];
          $scope.generatePermissions = function generatePermissions() {
            Permission.query().$promise.then(
                function(res) {
                  $scope.permissions = res;
                  $scope.role.permissionsInModel =
                      $scope.generatePermissionInputModel();
                },
                function(err) { Toast.error('Problem Fetching Permissions'); });
          };
          if ($stateParams.roleId) {
            $scope.role = angular.extend(Role.get({id : $stateParams.roleId}),
                                         $scope.role);
            console.log($scope.role);
            $scope.role.$promise.then(
                function(res) {
                  // = angular.extend($scope.role, res);
                  $scope.generatePermissions();
                },
                function(err) { Toast.error('Problem Fetching Role'); });

          } else {
            $scope.generatePermissions();
          }
          if (Authentication.isAuthenticated()) {
            $scope.roles = Role.query();
          }
          $scope.generatePermissionInputModel =
              function generatePermissionInputModel() {
            var i = 0;
            var len = $scope.permissions.length;
            var permissions = [];
            for (; i < len; i++) {
              var p = $scope.permissions[i];
              permissions.push({id : p.id, ticked : false});
              $scope.role.permissions.forEach(function(p2) {
                if (p2.id === p.id) {
                  permissions[i].ticked = true;
                }
              });
            }
            return permissions;
          };

          $scope.ifRoleExists = function(role) {
            if (role.hasOwnProperty('id')) {
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
          $scope.deleteThisRole = function deleteThisRole(role, pos) {
            var deleteConfirmed = confirm('Are You Sure Want To Delete "' +
                                          role.displayName() + '" Role');
            if (deleteConfirmed) {
              role.$delete();
              $scope.roles.splice(pos, 1);
            }
          };
          $scope.createOrEdit = function submitCreateOrEditForm(form, r) {

            if (form.$valid) {
              if (!$scope.ifRoleExists(r)) {
                var role = new Role(r);
                // delete role['permissionsInModel'];
                role.$save().then(
                    function(res) {
                      if (res.role) {
                        $scope.roles.push(res.role);
                        Toastr.success("Success!! Role Created");
                      }
                      if (!res.data || !res.roles) {
                        if (!res.error && !res.success) {
                          Toastr.error("Server Error! Something Went Wrong");
                        }
                      }
                      if (!res.success || res.error) {
                        displayErrors(res);
                      }
                    },
                    function(err) { displayErrors(err); });
              } else {
                $scope.role.$update().then(
                    function(res) {
                      if (!res.id) {
                        if (!res.data || !res.data.roles) {
                          if (!res.error && !res.success) {
                            Toastr.error("Server Error! Something Went Wrong");
                          }
                        }
                        if (!res.success || res.error) {
                          displayErrors(res);
                        }
                      } else {
                        for (var i = 0; i < $scope.roles.length; i++) {
                          if ($scope.roles[i].id === $scope.role.id) {
                            $scope.roles[i] = $scope.role;
                            $scope.role.permissionsInModel =
                                $scope.generatePermissionInputModel();
                            break;
                          }
                        }
                      }
                      Toastr.success('Success!!',
                                     'Role  ' + $scope.role.displayName() +
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
