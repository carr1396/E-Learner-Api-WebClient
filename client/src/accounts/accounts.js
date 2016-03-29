(function() {
  'use strict';
  angular.module('leanerAccountModule',
                 [
                   'leanerAccountAdministrationModule',
                   'leanerAccountSchoolsModule'
                 ])
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
          $stateProvider.state('accounts',
                               {
                                 url : "/app/",
                                 templateUrl : "app/accounts/accounts.html",
                                 controller : 'AccountsCtrl',
                                 resolve : routeAccessAuthorization.users,
                                 abstract : true
                               })
              .state(
                  'accounts.index',
                  {
                    url : 'me',
                    views : {
                      "accounts" : {templateUrl : "app/accounts/index.html"}
                    }
                  })
              .state('accounts.settings',
                     {
                       url : 'me/settings',
                       abstract : true,
                       views : {
                         "accounts" : {
                           templateUrl : "app/accounts/settings/settings.html"
                         }
                       }
                     })
              .state(
                  'accounts.settings.index',
                  {
                    url : '/',
                    views : {
                      "settings" :
                          {templateUrl : "app/accounts/settings/index.html"}
                    }
                  })
              .state('accounts.settings.password',
                     {
                       url : '/password',
                       views : {
                         "settings" : {
                           templateUrl : "app/accounts/settings/password.html",
                           controller : 'SettingsCtrl'
                         }
                       }
                     })
              .state('accounts.settings.schools', {
                url : '/schools',
                views : {
                  "settings" : {
                    templateUrl : "app/accounts/settings/schools.html",
                    controller : 'SchoolsSettingsCtrl'
                  }
                }
              });

        }
      ])
      .controller('AccountsCtrl', [
        '$scope',
        'Authentication',
        'Toastr',
        'Helpers',
        '$state',
        function($scope, Authentication, Toastr, Helpers, $state) {
          $scope.title = 'Accounts';

          $scope.isActiveIfNameContains = function isActiveLink(name) {
            return $state.current.name.indexOf(name) != -1;
          };

          $scope.getCurrentUser = Authentication.getCurrentUser;
          $scope.isAuthenticated = Authentication.isAuthenticated;
          $scope.routes = [
            {
              name : 'accounts.settings.index',
              url : '#/app/me/settings/',
              text : 'Settings',
              type : 'settings',
              icon : 'cog',
              visible : true
            },
            {
              name : 'accounts.admin.index',
              url : '#/app/administration/',
              text : 'Administration',
              type : 'admin',
              icon : 'cogs',
              visible : $scope.getCurrentUser().isAdmin() ||
                            $scope.getCurrentUser().isSuperAdmin()
            },
            {
              name : 'accounts.schools.index',
              url : '#/app/schools/',
              text : 'Schools',
              type : 'accounts.schools',
              icon : 'building',
              visible : true
            },
          ];

        }
      ]);
})();
