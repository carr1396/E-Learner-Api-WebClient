(function() {
  'use strict';
  angular.module(
             'leanerAccountAdministrationSchoolModuleEditRegistrationManual',
             [])
      .controller('SchoolAdminEditRegistrationManualCtrl', [
        '$scope',
        '$state',
        '$stateParams',
        'School',
        'Helpers',
        'Toastr',
        'Membership',
        function($scope, $state, $stateParams, School, Helpers, Toastr,
                 Membership) {
          $scope.schoolID = $stateParams.schoolId;
          $scope.type = "student";

          $scope.registrant = {active : 1};
          $scope.currentRegistrationTypeChange =
              function currentRegistrationTypeChange() {
            $scope.registrant = {active : 1};
            $scope.registrant.type = $scope.type;
          };
          $scope.resetRegistrantForm = function resetRegistrantForm() {
            $scope.registrant = {active : 1};
            $scope.registrant.type = $scope.type;
          };
          $scope.showLecturerStudentIDField = Helpers.stringAContainsB;
          $scope.manuallyRegister = function manuallyRegister(form) {

            if (form.$valid) {
              $scope.registrant.schoolID = $scope.schoolID;
              $scope.registrant.type = $scope.type;
              if ($scope.type !== 'course') {
                $scope.membership = new Membership($scope.registrant);
                $scope.membership.$save().then(function(res) {
                  if (res.error || res.success === false || !res.id) {
                    Helpers.displayErrors($scope, res, Toastr);
                  } else {
                    Toastr.success(
                        'Success!!',
                        'You Have Successfully Subscribed A New User to Your School');
                    $state.go(
                        'accounts.admin.schools.edit.registration.manual.update.index');
                  }
                });
              } else {
                console.log('COurse');
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
