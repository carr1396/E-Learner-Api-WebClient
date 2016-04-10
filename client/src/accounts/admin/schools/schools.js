(function() {
  'use strict';
  angular.module('leanerAccountAdministrationSchoolModule',
                 [ 'leanerAccountAdministrationSchoolModuleEdit' ])
      .config([
        '$locationProvider',
        '$stateProvider',
        function($locationProvider, $stateProvider) {
          var routeAccessAuthorization = {
            admin : {
              auth : function(Authentication) {
                return Authentication.userAccessAuthorizationIfEither(
                    [ 'admin', 'superadmin' ]);
              }
            }
          };
          $stateProvider.state(
                            'accounts.admin.schools',
                            {
                              url : '/schools',
                              abstract : true,
                              views : {
                                "administration" : {
                                  templateUrl :
                                      "app/accounts/admin/schools/schools.html",
                                  controller : 'SchoolAdminCtrl'
                                }
                              }
                            })
              .state('accounts.admin.schools.index',
                     {
                       url : '',
                       views : {
                         "schools" : {
                           templateUrl : "app/accounts/admin/schools/index.html"
                         }
                       }
                     })
              .state('accounts.admin.schools.edit',
                     {
                       url : '/:schoolId/edit',
                       abstract : true,
                       views : {
                         "schools" : {
                           templateUrl :
                               "app/accounts/admin/schools/edit/edit.html",
                           controller : 'SchoolAdminEditCtrl'
                         }
                       }
                     })
              .state('accounts.admin.schools.edit.profile',
                     {
                       url : '/profile',
                       views : {
                         "schoolsEditView" : {
                           templateUrl :
                               "app/accounts/admin/schools/edit/profile.html",
                           controller : 'SchoolAdminEditCtrl'
                         }
                       }
                     })
              .state('accounts.admin.schools.edit.api',
                     {
                       url : '/api',
                       views : {
                         "schoolsEditView" : {
                           templateUrl :
                               "app/accounts/admin/schools/edit/api.html",
                           controller : 'SchoolAdminEditAPICtrl'
                         }
                       }
                     })
              .state(
                  'accounts.admin.schools.edit.registration',
                  {
                    url : '/registrationandupdate',
                    abstract : true,
                    views : {
                      "schoolsEditView" : {
                        templateUrl :
                            "app/accounts/admin/schools/edit/registration/registration.html",
                        controller : 'SchoolAdminEditAPICtrl'
                      }
                    }
                  })
              .state(
                  'accounts.admin.schools.edit.registration.index',
                  {
                    url : '/index',
                    views : {
                      "schoolRegistration" : {
                        templateUrl :
                            "app/accounts/admin/schools/edit/registration/index.html"
                      }
                    }
                  })
              .state(
                  'accounts.admin.schools.edit.registration.api',
                  {
                    url : '/api',
                    abstract : true,
                    views : {
                      "schoolRegistration" : {
                        templateUrl :
                            "app/accounts/admin/schools/edit/registration/api/api.html",
                        controller : 'SchoolAdminEditRegistrationAPICtrl'
                      }
                    }
                  })
              .state(
                  'accounts.admin.schools.edit.registration.api.index',
                  {
                    url : '',
                    views : {
                      "schoolRegistrationAPI" : {
                        templateUrl :
                            "app/accounts/admin/schools/edit/registration/api/index.html"
                      }
                    }
                  })
              .state(
                  'accounts.admin.schools.edit.registration.api.registration',
                  {
                    url : '/registration',
                    views : {
                      "schoolRegistrationAPI" : {
                        templateUrl :
                            "app/accounts/admin/schools/edit/registration/api/registration.html"
                      }
                    }
                  })
              .state(
                  'accounts.admin.schools.edit.registration.api.update',
                  {
                    url : '/update',
                    views : {
                      "schoolRegistrationAPI" : {
                        templateUrl :
                            "app/accounts/admin/schools/edit/registration/api/update.html"
                      }
                    }
                  })
              .state(
                  'accounts.admin.schools.edit.registration.manual',
                  {
                    url : '/manual',
                    abstract : true,
                    views : {
                      "schoolRegistration" : {
                        templateUrl :
                            "app/accounts/admin/schools/edit/registration/manual/manual.html"
                      }
                    }
                  })
              .state(
                  'accounts.admin.schools.edit.registration.manual.registration',
                  {
                    url : '/registration',
                    views : {
                      "schoolRegistrationManual" : {
                        templateUrl :
                            "app/accounts/admin/schools/edit/registration/manual/registration.html",
                        controller : 'SchoolAdminEditRegistrationManualCtrl'
                      }
                    }
                  })
              .state(
                  'accounts.admin.schools.edit.registration.manual.index',
                  {
                    url : '',
                    views : {
                      "schoolRegistrationManual" : {
                        templateUrl :
                            "app/accounts/admin/schools/edit/registration/manual/index.html"
                      }
                    }
                  })
              .state(
                  'accounts.admin.schools.edit.registration.manual.update',
                  {
                    url : '/update',
                    abstract : true,
                    views : {
                      "schoolRegistrationManual" : {
                        templateUrl :
                            "app/accounts/admin/schools/edit/registration/manual/update/update.html",
                        controller :
                            'SchoolAdminEditRegistrationManualUpdateCtrl'
                      }
                    }
                  })
              .state(
                  'accounts.admin.schools.edit.registration.manual.update.index',
                  {
                    url : '',
                    views : {
                      "schoolManualUpdateView" : {
                        templateUrl :
                            "app/accounts/admin/schools/edit/registration/manual/update/index.html"
                      }
                    }
                  })
              .state(
                  'accounts.admin.schools.edit.registration.manual.update.lecturers',
                  {
                    url : '/lecturers',
                    views : {
                      "schoolManualUpdateView" : {
                        templateUrl :
                            "app/accounts/admin/schools/edit/registration/manual/update/lecturers.html"
                      }
                    }
                  })
              .state(
                  'accounts.admin.schools.edit.registration.manual.update.courses',
                  {
                    url : '/courses',
                    views : {
                      "schoolManualUpdateView" : {
                        templateUrl :
                            "app/accounts/admin/schools/edit/registration/manual/update/courses.html"
                      }
                    }
                  })
              .state(
                  'accounts.admin.schools.edit.registration.manual.update.administrators',
                  {
                    url : '/administrators',
                    views : {
                      "schoolManualUpdateView" : {
                        templateUrl :
                            "app/accounts/admin/schools/edit/registration/manual/update/administrators.html"
                      }
                    }
                  })
              .state(
                  'accounts.admin.schools.edit.registration.manual.update.membersEdit',
                  {
                    url : '/members/:memberId/edit',
                    views : {
                      "schoolManualUpdateView" : {
                        templateUrl :
                            "app/accounts/admin/schools/edit/registration/manual/update/member.html",
                        controller :
                            'SchoolAdminEditRegistrationManualUpdateMemberCtrl'
                      }
                    }
                  })
              .state(
                  'accounts.admin.schools.edit.registration.manual.update.courseEdit',
                  {
                    url : '/courses/:courseId/edit',
                    views : {
                      "schoolManualUpdateView" : {
                        templateUrl :
                            "app/accounts/admin/schools/edit/registration/manual/update/courseEdit.html",
                        controller :
                            'SchoolAdminEditRegistrationManualUpdateCourseCtrl'
                      }
                    }
                  });
        }
      ])
      .controller('SchoolAdminCtrl', [
        '$scope',
        'Authentication',
        'School',
        '$state',
        '$stateParams',
        function($scope, Authentication, School, $state, $stateParams) {
          $scope.getCurrentUser = Authentication.getCurrentUser;
          $scope.schools = School.mine({id : 'mine'});
          $scope.refreshSchools = function refreshSchools() {
            $scope.schools = School.mine({id : 'mine'});
          };

        }
      ]);
})();
