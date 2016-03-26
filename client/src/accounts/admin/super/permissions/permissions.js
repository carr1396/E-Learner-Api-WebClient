(function() {
  'use strict';
  angular.module('leanerAdminSuperPermissionModule', [])
      .controller('PermissionsCtrl', [
        '$scope',
        '$stateParams',
        'Toastr',
        'Permission',
        function($scope, $stateParams, Toastr, Permission) {
          $scope.title = 'Permissions';

          if ($stateParams.permissionId) {
            $scope.permission =
                Permission.get({id : $stateParams.permissionId});
          } else {
            $scope.permission = {};
          }
          $scope.permissions = Permission.query();
          $scope.ifPermissionExists = function(permission) {
            if (permission.hasOwnProperty('id')) {
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
          $scope.deleteThisPermission = function deleteThisPermission(
              permission, pos) {
            var deleteConfirmed =
                confirm('Are You Sure Want To Delete "' +
                        permission.displayName() + '" Permission');
            if (deleteConfirmed) {
              permission.$delete();
              $scope.permissions.splice(pos, 1);
            }
          };
          $scope.createOrEdit = function submitCreateOrEditForm(form, r) {
            if (form.$valid) {
              if (!$scope.ifPermissionExists(r)) {
                var permission = new Permission(r);
                permission.$save().then(
                    function(res) {
                      if (res.permission) {
                        $scope.permissions.push(res.permission);
                        Toastr.success("Success!! Permission Created");
                      }
                      if (!res.data || !res.permission) {
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
                $scope.permission.$update().then(
                    function(res) {
                      if (!res.id) {
                        if (!res.data || !res.data.permission) {
                          if (!res.error && !res.success) {
                            Toastr.error("Server Error! Something Went Wrong");
                          }
                        }
                        if (!res.success || res.error) {
                          displayErrors(res);
                        }
                      } else {
                        for (var i = 0; i < $scope.permissions.length; i++) {
                          if ($scope.permissions[i].id ===
                              $scope.permission.id) {
                            $scope.permissions[i] = $scope.permission;
                            break;
                          }
                        }
                      }
                      Toastr.success('Success!!',
                                     'Permission  ' +
                                         $scope.permission.displayName() +
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
