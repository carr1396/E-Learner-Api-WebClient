(function() {
  'use strict';
  angular.module(
             'leanerAccountAdministrationSchoolModuleEditRegistrationManual')
      .controller(
          'SchoolAdminEditRegistrationManualUpdateCtrl',
          [
            '$scope',
            '$state',
            '$stateParams',
            'School',
            'Helpers',
            'Toastr',
            'Membership',
            function($scope, $state, $stateParams, School, Helpers, Toastr,
                     Membership) {
              $scope.typeContains = Helpers.stringAContainsB;
              $scope.registrant = {type : 'student'};
              $scope.schoolID = $stateParams.schoolId;
              // console.log($scope.schoolID);
              $scope.showLecturerStudentIDField = Helpers.stringAContainsB;
              $scope.types = [
                {value : 'student', text : 'Student'},
                {value : 'student_lecturer', text : 'Student Lecturer'},
                {value : 'lecturer', text : 'Lecturer'},
                {
                  value : 'admin_student_lecturer',
                  text : 'Admin Student Lecturer'
                },
                {value : 'admin_lecturer', text : 'Admin Lecturer'},
                {value : 'admin', text : 'Administrator'}
              ];
              $scope.deactivateActivateMembership =
                  function deactivateActivateMembership(mid, pos) {
                var active = $scope.members[pos].active === 1 ||
                                     $scope.members[pos].active === true
                                 ? true
                                 : false;
                console.log(active);
                $scope.members[pos].active = !active;
                var m = new Membership($scope.members[pos]);
                m.$update({id : mid})
                    .then(function(res) {
                      if (res.error || res.success === false) {
                        Helpers.displayErrors($scope, res, Toastr);
                        $scope.members[pos].active =
                            !$scope.members[pos].active;
                      } else {
                        Toastr.success('Success!!', 'Membership Updated');
                      }
                    });
              };
              $scope.deleteMembership = function deleteMembership(mid, pos) {
                Membership.delete({id : mid})
                    .$promise.then(function(res) {
                      if (res.error || res.success === false) {
                        Helpers.displayErrors($scope, res, Toastr);
                      } else {
                        $scope.members.splice(pos, 1);
                        Toastr.success('Success!!', 'Membership Deleted')
                      }
                    });
              };
              $scope.manRegisterAlreadyExistingUser =
                  function manRegisterAlreadyExistingUser(form) {
                if (form.$valid) {
                  $scope.registrant.schoolID = $scope.schoolID;
                  $scope.registrant.exists = true;
                  $scope.membership = new Membership($scope.registrant);
                  $scope.membership.$save().then(function(res) {
                    if (res.error || res.success === false || !res.id) {
                      Helpers.displayErrors($scope, res, Toastr);
                    } else {
                      $scope.registrant = {type : 'student'};
                      Toastr.success(
                          'Success!!',
                          'You Have Successfully Subscribed A New User to Your School');
                      $state.go(
                          'accounts.admin.schools.edit.registration.manual.index');
                    }
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
              if (!$stateParams.memberId) {
                $scope.members = $scope.members ||
                                 School.members({id : $stateParams.schoolId});
              }
            }
          ])
      .controller(
          'SchoolAdminEditRegistrationManualUpdateMemberCtrl',
          [
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
              $scope.typeContains = Helpers.stringAContainsB;
              $scope.types = [
                {value : 'student', text : 'Student'},
                {value : 'student_lecturer', text : 'Student Lecturer'},
                {value : 'lecturer', text : 'Lecturer'},
                {
                  value : 'admin_student_lecturer',
                  text : 'Admin Student Lecturer'
                },
                {value : 'admin_lecturer', text : 'Admin Lecturer'},
                {value : 'admin', text : 'Administrator'}
              ];
              $scope.showLecturerStudentIDField = Helpers.stringAContainsB;
              $scope.member =
                  $scope.member || Membership.get({id : $stateParams.memberId});

              $scope.currentRegistrationTypeChange =
                  function currentRegistrationTypeChange(t) {};

              $scope.manuallyUpdateMembership =
                  function manuallyUpdateMembership(form) {
                var result = $scope.member;
                if (form.$valid) {
                  $scope.member.$update().then(function(res) {
                    if (res.error || res.success === false) {
                      Helpers.displayErrors($scope, res, Toastr);
                    } else {
                      $scope.member = res;
                      Toastr.success('Success!!', 'Membership Updated')
                    }
                  })
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
      .controller('SchoolAdminEditRegistrationManualUpdateCourseCtrl', [
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
          $scope.typeContains = Helpers.stringAContainsB;

        }
      ]);
})();
