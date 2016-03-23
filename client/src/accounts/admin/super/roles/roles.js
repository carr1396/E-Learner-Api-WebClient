(function() {
  'use strict';
  angular.module('leanerAdminSuperRoleModule', [])
      .controller('RolesCtrl', [
        '$scope',
        '$stateParams',
        'Toastr',
        'Role',
        function($scope, $stateParams, Toastr, Role) {
          $scope.title = 'Roles';

          if ($stateParams.roleId) {
            $scope.role = Role.get({id : $stateParams.roleId});
          } else {
            $scope.role = {};
          }
          $scope.roles = Role.query();
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
          $scope.createOrEdit = function submitCreateOrEditForm(form, r) {
            if (form.$valid) {
              if (!$scope.ifRoleExists(r)) {
                var role = new Role(r);
                role.$save().then(
                    function(res) {
                      if (res.id) {
                        console.log(res);
                      }
                      if (!res.data || !res.data.roles) {
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
