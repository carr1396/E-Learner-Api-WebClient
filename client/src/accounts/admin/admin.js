(function() {
  'use strict';
  angular.module('leanerAccountAdministrationModule',
                 [
                   'leanerAccountAdministrationSuperModule',
                   'leanerAccountAdministrationSchoolModule'
                 ])
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
                            'accounts.admin',
                            {
                              url : 'administration',
                              abstract : true,
                              resolve : routeAccessAuthorization.admin,
                              views : {
                                "accounts" : {
                                  templateUrl : "app/accounts/admin/admin.html",
                                  controller : 'AdministrationCtrl'
                                }
                              }
                            })
              .state('accounts.admin.index', {
                url : '/',
                views : {
                  "administration" :
                      {templateUrl : "app/accounts/admin/index.html"}
                }
              });

        }
      ])
      .controller('AdministrationCtrl', [
        '$scope',
        'Authentication',
        function($scope, Authentication) {
          $scope.getCurrentUser = Authentication.getCurrentUser;
        }
      ]);
})();
