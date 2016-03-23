(function() {
  'use strict';
  angular.module('leanerAccountModule', [ 'leanerAccountAdministrationModule' ])
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
                                 url : "/accounts/",
                                 templateUrl : "app/accounts/accounts.html",
                                 controller : 'AccountsCtrl',
                                 resolve : routeAccessAuthorization.users,
                                 abstract : true
                               })
              .state('accounts.index', {
                url : 'me',
                views :
                    {"accounts" : {templateUrl : "app/accounts/index.html"}}
              });

        }
      ])
      .controller('AccountsCtrl', [
        '$scope',
        'Authentication',
        function($scope, Authentication) {
          $scope.title = 'Accounts';
          $scope.getCurrentUser = Authentication.getCurrentUser;
          $scope.routes = [
            {
              name : 'accounts.admin.index',
              url : '#/acounts/administration/',
              text : 'Administration',
              icon : 'cogs',
              visible : $scope.getCurrentUser().isAdmin() ||
                            $scope.getCurrentUser().isSuperAdmin()
            },
            // {
            //   name : 'accounts.roles.index',
            //   url : '#/acounts/roles',
            //   text : 'Roles',
            //   visible : true
            // }
          ];
        }
      ]);
})();
