(function() {
  'use strict';
  angular.module('leanerAccountAdministrationSuperModule',
                 [ 'leanerAdminSuperRoleModule' ])
      .config([
        '$locationProvider',
        '$stateProvider',
        function($locationProvider, $stateProvider) {
          var routeAccessAuthorization = {
            superadmin : {
              auth : function(Authentication) {
                return Authentication.userAccessAuthorization('superadmin');
              }
            }
          };
          $stateProvider.state('accounts.admin.super',
                               {
                                 url : '/super',
                                 abstract : true,
                                 resolve : routeAccessAuthorization.superadmin,
                                 views : {
                                   "administration" : {
                                     templateUrl :
                                         "app/accounts/admin/super/super.html"
                                   }
                                 }
                               })
              .state('accounts.admin.super.index',
                     {
                       url : '',
                       views : {
                         "supers" : {
                           templateUrl : "app/accounts/admin/super/index.html"
                         }
                       }
                     })
              .state('accounts.admin.super.roles',
                     {
                       url : '/roles/index',
                       views : {
                         "supers" : {
                           templateUrl :
                               "app/accounts/admin/super/roles/index.html",
                           controller : 'RolesCtrl'
                         }
                       }
                     })
              .state('accounts.admin.super.rolesEdit', {
                url : '/roles/:roleId/edit',
                views : {
                  "supers" : {
                    templateUrl : "app/accounts/admin/super/roles/index.html",
                    controller : 'RolesCtrl'
                  }
                }
              });

        }
      ])
      .controller('SuperAdministrationCtrl', [ '$scope', function($scope) {} ]);
})();
