(function() {
  'use strict';
  angular.module('leanerAccountSchoolsModule', [])
      .config([
        '$locationProvider',
        '$stateProvider',
        function($locationProvider, $stateProvider) {
          var routeAccessAuthorization = {
            users : {
              auth : function(Authentication) {
                return Authentication.authroizeAccessForAuthenticatedUser();
              }
            }
          };
          $stateProvider.state('accounts.schools',
                               {
                                 url : "schools",
                                 //  resolve : routeAccessAuthorization.users,
                                 abstract : true,
                                 views : {
                                   'accounts' : {
                                     templateUrl :
                                         "app/accounts/schools/schools.html",
                                     controller : 'SchoolAccountCtrl'
                                   }
                                 }
                               })
              .state('accounts.schools.index',
                     {
                       url : '',
                       views : {
                         "schools-view" : {
                           templateUrl : "app/accounts/schools/index.html",
                           controller : 'SchoolAccountCtrl'
                         }
                       }
                     })
              .state('accounts.schools.show', {
                url : '/:schoolId/show',
                views : {
                  "schools-view" : {
                    templateUrl : "app/accounts/schools/show.html",
                    controller : 'SchoolAccountCtrl'
                  }
                }
              });
        }
      ])
      .controller('SchoolAccountCtrl', [
        '$scope',
        'Authentication',
        'School',
        '$state',
        function($scope, Authentication, School, $state) {
          $scope.getCurrentUser = Authentication.getCurrentUser;

          if ($state.params.schoolId) {
            $scope.school =
                $scope.school || School.get({id : $state.params.schoolId});
          } else {
            $scope.schools = School.available({id : 'public'});
            $scope.memberships = School.memberships({id : 'me'});
            $scope.refreshSchools = function refreshSchools() {
              $scope.schools = School.available({id : 'public'});
              $scope.memberships = School.memberships({id : 'me'});
            };
          }
        }
      ]);
})();
