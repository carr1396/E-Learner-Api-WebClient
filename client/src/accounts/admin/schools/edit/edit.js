(function() {
  'use strict';
  angular.module(
             'leanerAccountAdministrationSchoolModuleEdit',
             [
               'leanerAccountAdministrationSchoolModuleEditRegistrationManual'
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
        function($scope, Authentication, School, $state, $stateParams) {
          $scope.getCurrentUser = Authentication.getCurrentUser;
          if ($state.params.schoolId) {
            $scope.school =
                $scope.school || School.get({id : $state.params.schoolId});
          }
        }
      ]);

})();
