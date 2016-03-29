(function() {
  'use strict';
  angular.module('leanerAccountAdministrationSchoolModule', [])
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
                    url : '/registration',
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
                    views : {
                      "schoolRegistration" : {
                        templateUrl :
                            "app/accounts/admin/schools/edit/registration/api.html"
                      }
                    }
                  })
              .state('accounts.admin.schools.edit.registration.manual', {
                url : '/manual',
                views : {
                  "schoolRegistration" : {
                    templateUrl :
                        "app/accounts/admin/schools/edit/registration/manual.html"
                  }
                }
              });
        }
      ])
      .controller(
          'SchoolAdminCtrl',
          [
            '$scope',
            'Authentication',
            'School',
            '$state',
            '$stateParams',
            function($scope, Authentication, School, $state, $stateParams) {
              $scope.getCurrentUser = Authentication.getCurrentUser;
              $scope.schools = School.mine({id : 'me'});
              $scope.refreshSchools = function refreshSchools() {
                $scope.schools = School.mine({id : 'me'});
              };

            }
          ])
      .controller(
          'SchoolAdminEditCtrl',
          [
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
