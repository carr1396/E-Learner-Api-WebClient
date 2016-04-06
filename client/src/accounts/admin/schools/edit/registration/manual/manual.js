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
        'Category',
        'Course',
        function($scope, $state, $stateParams, School, Helpers, Toastr,
                 Membership, Category, Course) {
          $scope.schoolID = $stateParams.schoolId;
          $scope.type = "course";
          $scope.categories = [];
          Category.lists().$promise.then(function(res) {
            if (res.length > 0) {
              $scope.categories = $scope.generateCategoresInputModel(res);
            }
          });
          $scope.generateCategoresInputModel =
              function generateCategoresInputModel(categories) {
            var i = 0;
            var len = categories.length;
            var cats = [];
            for (; i < len; i++) {
              var p = categories[i];
              cats.push({id : p.id, name : p.name, ticked : false});
              $scope.registrant.categories.forEach(function(p2) {
                if (p2.id === p.id) {
                  cats[i].ticked = true;
                }
              });
            }
            return cats;
          };
          $scope.registrant = {active : 1};
          $scope.registrant.categories = [];
          $scope.currentRegistrationTypeChange =
              function currentRegistrationTypeChange() {
            $scope.registrant = {active : 1};
            $scope.registrant.type = $scope.type;
            $scope.registrant.categories = [];
          };
          $scope.resetRegistrantForm = function resetRegistrantForm() {
            $scope.registrant = {active : 1};
            $scope.registrant.type = $scope.type;
            $scope.registrant.categories = [];
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
                $scope.course = new Course($scope.registrant);
                $scope.course.categories = [];
                $scope.registrant.categories.forEach(function(c) {
                  $scope.course.categories.push(c.id);
                });
                $scope.course.$save().then(function(res) {
                  if (res.error || res.success === false || !res.id) {
                    Helpers.displayErrors($scope, res, Toastr);
                  } else {
                    Toastr.success(
                        'Success!!',
                        'You Have Successfully Subscribed A New Course to Your School');
                    $scope.resetRegistrantForm();
                    $state.go(
                        'accounts.admin.schools.edit.registration.manual.update.courses');
                  }
                });
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
