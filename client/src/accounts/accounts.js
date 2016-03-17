(function() {
  'use strict';
  angular.module('leanerAccountModule', [])
      .config([
        '$locationProvider',
        '$stateProvider',
        '$urlRouterProvider',
        function($locationProvider, $stateProvider, $urlRouterProvider) {
          $stateProvider.state('accounts',
                               {
                                 url : "/accounts/",
                                 templateUrl : "app/accounts/accounts.html",
                                 controller : 'AccountsCtrl',
                                 abstract : true
                               })
              .state('accounts.index', {
                url : '',
                views :
                    {"accounts" : {templateUrl : "app/accounts/index.html"}}
              });
        }
      ])
      .controller(
          'AccountsCtrl',
          [ '$scope', function($scope) { $scope.title = 'Accounts'; } ]);
})();
