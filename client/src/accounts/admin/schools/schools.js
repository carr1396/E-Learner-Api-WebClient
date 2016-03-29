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
              .state('accounts.admin.schools.edit', {
                url : '/:schoolId/edit',
                views : {
                  "schools" :
                      {templateUrl : "app/accounts/admin/schools/edit.html"}
                }
              });
        }
      ])
      .controller('SchoolAdminCtrl', [
        '$scope',
        'Authentication',
        'School',
        '$state',
        function($scope, Authentication, School, $state) {
          $scope.getCurrentUser = Authentication.getCurrentUser;
          $scope.schools = School.mine({id : 'me'});
          $scope.refreshSchools = function refreshSchools() {
            $scope.schools = School.mine({id : 'me'});
          };
          if ($state.params.schoolId) {
            $scope.school = School.get({id : $state.params.schoolId});
          }
        }
      ]);
})();
