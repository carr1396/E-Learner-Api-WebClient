(function() {
  'use strict';
  angular.module('leanerAccountAdministrationSchoolModuleEditRegistrationAPI',
                 [])
      .controller('SchoolAdminEditRegistrationAPICtrl', [
        '$scope',
        '$state',
        '$stateParams',
        'School',
        'Helpers',
        'Toastr',
        'Membership',
        'Category',
        'Course',
        '$http',
        'LeanerRequestQueue',
        'Student',
        function($scope, $state, $stateParams, School, Helpers, Toastr,
                 Membership, Category, Course, $http, LRQ, Student) {
          $scope.schoolID = $stateParams.schoolId;
          $scope.school = $scope.school || $scope.$parent.school ||
                          School.get({id : $scope.schoolID});
          $scope.collapseAPIBASEURL = true;
          $scope.collapseADMINVERIFICATIONURL = true;
          $scope.collapseStudentUpdateResults = true;
          $scope.collapseLecturerUpdateResults = true;
          $scope.collapseCourseAssociateStudentsUpdateResults = true;
          $scope.registrant = {};
          $scope.registrant.api_base_url = {};
          $scope.registrant.admin_verification_url = {};
          $scope.registrant.student_update_url = {};
          $scope.registrant.lecturer_update_url = {};
          $scope.registrant.course_update_url = {};
          $scope.registrant.course_associate_lecturer_update_url = {};
          $scope.registrant.course_associate_student_update_url = {};
          $scope.sanitizeAppHTML = Helpers.sanitizeAppHTML;

          $scope.submitRegistrationUrl = function submitRegistrationUrl(form,
                                                                        url) {
            if (form.$valid && url) {
              $http.get(url,
                        {
                          transformRequest : angular.identity,
                          headers : {'Authorization' : undefined}
                        })
                  .then(
                      function successCallback(response) {
                        // console.log(response);
                        if (!response.data || response.status === -1) {
                          Helpers.displayErrors($scope, response.data, Toastr);
                        }
                        if (response.data && response.status === 200) {
                          // TODO support other status codes that may be okay
                          if (url === $scope.school.api_base_url) {
                            $scope.registrant.api_base_url.response = response;
                            $scope.registrant.api_base_url.result =
                                response.data;
                          }
                          if (url === $scope.school.admin_verification_url) {
                            $scope.registrant.admin_verification_url.response =
                                response;
                            $scope.registrant.admin_verification_url.result =
                                response.data;
                          }
                          $scope.studentCount = 0;
                          $scope.studentCountSuccess = 0;
                          $scope.studentCountErrors = 0;
                          if (url === $scope.school.student_update_url) {
                            $scope.registrant.student_update_url.response =
                                response;
                            $scope.registrant.student_update_url.result =
                                response.data;
                            if ($scope.studentCount < response.data.length) {
                              var count = 0;
                              $scope.error = '';
                              response.data.forEach(function(stud) {
                                delete stud.id;
                                var nstd = new Membership(stud);
                                nstd.schoolID = $scope.schoolID;
                                nstd.type = 'student';
                                $scope.errors = [];
                                LRQ(nstd.$save())
                                    .then(function(res) {
                                      count++;
                                      if (res.error) {
                                        $scope.error =
                                            Helpers.displayErrorsQueue(
                                                $scope, res, Toastr, count + 1,
                                                'Student');
                                        $scope.studentCountErrors++;
                                      } else {
                                        $scope.studentCountSuccess++;
                                      }
                                      $scope.studentCount = count;
                                    });
                              });
                            }
                          }
                          $scope.courseCount = 0;
                          $scope.courseCountSuccess = 0;
                          $scope.courseCountErrors = 0;
                          if (url === $scope.school.course_update_url &&
                              $scope.courseCount < response.data.length) {
                            $scope.courseCount = 0;
                            $scope.courseCountSuccess = 0;
                            $scope.courseCountErrors = 0;

                            $scope.registrant.course_update_url.response =
                                response;
                            $scope.registrant.course_update_url.result =
                                response.data;
                            if ($scope.courseCount < response.data.length) {
                              var count = 0;
                              $scope.error = '';
                              response.data.forEach(function(stud) {
                                delete stud.id;
                                var nstd = new Course(stud);
                                nstd.schoolID = $scope.schoolID;
                                nstd.type = 'course';
                                $scope.errors = [];
                                LRQ(nstd.$save())
                                    .then(function(res) {
                                      count++;
                                      if (res.error) {
                                        $scope.error =
                                            Helpers.displayErrorsQueue(
                                                $scope, res, Toastr, count + 1,
                                                'Course');
                                        $scope.courseCountErrors++;
                                      } else {
                                        $scope.courseCountSuccess++;
                                      }
                                      $scope.courseCount = count;
                                    });
                              });
                            }
                          }
                          if (url ===
                              $scope.school
                                  .course_associate_student_update_url) {
                            $scope.courseAssociateStudentCount = 0;
                            $scope.courseAssociateStudentCountSuccess = 0;
                            $scope.courseAssociateStudentCountErrors = 0;
                            $scope.registrant
                                .course_associate_student_update_url.response =
                                response;
                            $scope.registrant
                                .course_associate_student_update_url.result =
                                response.data;
                            if ($scope.courseAssociateStudentCount <
                                response.data.length) {
                              var count = 0;
                              $scope.error = '';
                              response.data.forEach(function(stud) {
                                delete stud.id;
                                stud.schoolID = $scope.schoolID;
                                stud.type = 'course_assoicate_student';
                                $scope.errors = [];
                                $scope.error = '';
                                LRQ($http.post(
                                        '/api/v1/courses/subscriptions/update',
                                        stud))
                                    .then(function(res) {
                                      count++;
                                      if (res.data.error) {
                                        $scope.error =
                                            Helpers.displayErrorsQueue(
                                                $scope, res.data, Toastr,
                                                count + 1,
                                                'Course Student Associate');
                                        $scope
                                            .courseAssociateStudentCountErrors++;
                                      } else {
                                        $scope
                                            .courseAssociateStudentCountSuccess++;
                                      }
                                      $scope.courseAssociateStudentCount =
                                          count;
                                    });
                              });
                            }
                          }
                          if (url ===
                              $scope.school
                                  .course_associate_lecturer_update_url) {
                            $scope.courseAssociateLecturerCount = 0;
                            $scope.courseAssociateLecturerCountSuccess = 0;
                            $scope.courseAssociateLecturerCountErrors = 0;
                            $scope.registrant
                                .course_associate_lecturer_update_url.response =
                                response;
                            $scope.registrant
                                .course_associate_lecturer_update_url.result =
                                response.data;
                            if ($scope.courseAssociateLecturerCount <
                                response.data.length) {
                              var count = 0;
                              $scope.error = '';
                              response.data.forEach(function(stud) {
                                delete stud.id;
                                stud.schoolID = $scope.schoolID;
                                stud.type = 'course_assoicate_lecturer';
                                $scope.errors = [];
                                $scope.error = '';
                                LRQ($http.post(
                                        '/api/v1/courses/lecturers/update',
                                        stud))
                                    .then(function(res) {
                                      count++;
                                      if (res.data.error) {
                                        $scope.error =
                                            Helpers.displayErrorsQueue(
                                                $scope, res.data, Toastr,
                                                count + 1,
                                                'Course Lecturer Associate');
                                        $scope
                                            .courseAssociateLecturerCountErrors++;
                                      } else {
                                        $scope
                                            .courseAssociateLecturerCountSuccess++;
                                      }
                                      $scope.courseAssociateLecturerCount =
                                          count;
                                    });
                              });
                            }
                          }
                          if (url === $scope.school.lecturer_update_url) {
                            $scope.lecturerCount = 0;
                            $scope.lecturerCountSuccess = 0;
                            $scope.lecturerCountErrors = 0;
                            $scope.registrant.lecturer_update_url.response =
                                response;
                            $scope.registrant.lecturer_update_url.result =
                                response.data;
                            if ($scope.lecturerCount < response.data.length) {
                              var count = 0;
                              $scope.error = '';
                              response.data.forEach(function(stud) {
                                delete stud.id;
                                var nstd = new Membership(stud);
                                nstd.schoolID = $scope.schoolID;
                                nstd.type = 'lecturer';
                                $scope.errors = [];
                                LRQ(nstd.$save())
                                    .then(function(res) {
                                      count++;
                                      if (res.error) {
                                        $scope.error =
                                            Helpers.displayErrorsQueue(
                                                $scope, res, Toastr, count + 1,
                                                'Lecturer');
                                        $scope.lecturerCountErrors++;
                                      } else {
                                        $scope.lecturerCountSuccess++;
                                      }
                                      $scope.lecturerCount = count;
                                    });
                              });
                            }
                          }
                        }
                      },
                      function errorCallback(response) {
                        Helpers.displayErrors($scope, response.data, Toastr);
                      });

            } else {
              Toastr.error(
                  'Something Is Wrong Refresh Page, Try Again Later Or Make Sure U Added This Particular API Route. ');
            }
          };

        }
      ]);
})();
