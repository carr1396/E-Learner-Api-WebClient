(function() {
  'use strict';

  angular.module('leanerAccountModule')
      .controller(
          'SchoolsSettingsCtrl',
          [
            '$scope',
            'Authentication',
            'Toastr',
            'School',
            function($scope, Authentication, Toastr, School) {
              $scope.getCurrentUser = Authentication.getCurrentUser;
              $scope.school = {private : true};
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
              $scope.createSchool = function createSchoolFormSubmitted(form) {
                if (form.$valid) {
                  var school = new School($scope.school);
                  school.$save().then(
                      function(res) {
                        if (res.school) {
                          Toastr.success("Success!! School Created");
                          $scope.school = {private : true};
                          if (res.isAdmin) {
                            Authentication.reAuthenticateUser();
                          }
                        }
                        if (!res.data || !res.school) {
                          if (!res.error && !res.success) {
                            displayErrors(res);
                          }
                        }
                        if (!res.success || res.error) {
                          displayErrors(res);
                        }
                      },
                      function(err) { displayErrors(err); });
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
          ])
      .controller('SettingsCtrl', [
        '$scope',
        'Authentication',
        'Toastr',
        function($scope, Authentication, Toastr) {
          $scope.getCurrentUser = Authentication.getCurrentUser;
          $scope.password = {};
          $scope.changePassword = function changePassword(form) {

            var password = $scope.password;
            if (form.$valid) {
              Authentication.changePassword($scope.getCurrentUser().id,
                                            password.password,
                                            password.confirmPassword)
                  .then(
                      function(res) {
                        Toastr.success("Congratulations!!!",
                                       'Your Password Has Been Reset');

                      },
                      function(err) {
                        $scope.errors = [];
                        $scope.messages = [];
                        $scope.errors.push(err.statusText);
                        if (err.data) {
                          if (err.data.error) {
                            $scope.errors.push(err.data.error);
                          }
                          if (err.data.errors) {
                            err.data.errors.forEach(function(e) {
                              $scope.push(e);
                            });
                          }
                        }
                        var error = '<ul class="list">';
                        $scope.errors.forEach(function(err) {
                          error += '<li> ' + err + ' </li>';
                        });
                        error += '</ul>';
                        Toastr.error(error);

                      });
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
