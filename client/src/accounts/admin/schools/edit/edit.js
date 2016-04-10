(function() {
  'use strict';
  angular.module(
             'leanerAccountAdministrationSchoolModuleEdit',
             [
               'leanerAccountAdministrationSchoolModuleEditRegistrationManual',
               'leanerAccountAdministrationSchoolModuleEditRegistrationAPI'
             ])
      .controller(
          'SchoolAdminEditCtrl',
          [
            '$scope',
            'Authentication',
            'School',
            '$state',
            '$stateParams',
            'Toastr',
            function($scope, Authentication, School, $state, $stateParams,
                     Toastr) {
              $scope.getCurrentUser = Authentication.getCurrentUser;
              if ($state.params.schoolId) {
                $scope.school =
                    $scope.school || School.get({id : $state.params.schoolId});
              }
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

              $scope.editThisSchool = function onEditSchoolFormSubmitted(form) {
                if (form.$valid) {
                  $scope.school.$update().then(function(res) {
                    if (res.error) {
                      displayErrors(res);
                    } else {
                      Toastr.success('Success!!',
                                     'Your School Profile Has Been Updated')
                    }
                  });
                } else {
                  Toastr.error('Error!!', 'Form Is Invalid');
                }
              };
            }
          ])
      .controller('SchoolAdminEditAPICtrl', [
        '$scope',
        'Authentication',
        'School',
        '$state',
        '$stateParams',
        '$http',
        '$q',
        'Toastr',
        'Helpers',
        function($scope, Authentication, School, $state, $stateParams, $http,
                 $q, Toastr, Helpers) {
          $scope.getCurrentUser = Authentication.getCurrentUser;
          $scope.schoolID = $stateParams.schoolId;
          if ($state.params.schoolId) {
            $scope.school = $scope.school || $scope.$parent.school ||
                            School.get({id : $state.params.schoolId});
          }
          $scope.verifyAPIURLExists = function verifyAPIURLExists(url) {
            if (url && url.length > 0) {
              // console.log(url);
              var defered = $q.defer();
              $http.get(url,
                        {
                          transformRequest : angular.identity,
                          headers : {'Authorization' : undefined}
                        })
                  .then(
                      function successCallback(response) {
                        // console.log(response);
                        if (!response.data || response.status === -1) {
                          defered.reject(false);
                        }
                        if (response.data && response.status === 200) {
                          // TODO support other status codes that may be okay
                          defered.resolve(true);
                        }
                      },
                      function errorCallback(response) {
                        // console.log(response);
                        defered.reject(false);
                      });
              return defered.promise;
            }
            return false;
          };

          $scope.updateAPISettings = function updateAPISettings(form) {
            if (form.$valid) {
              // http://192.168.10.101:3000/api/v1
              $http.put('/api/v1/schools/' + $scope.schoolID + '/api_settings',
                        $scope.school)
                  .then(function(value) {
                    if (!value.data.id) {
                      Helpers.displayErrors($scope, value.data, Toastr);
                    } else {
                      Toastr.success('API Seetings Set', 'Success');
                    }
                  });
            } else {
              console.log('Invalid');
            }
          };
        }
      ]);

})();
