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
                                   }
                                 }
                               })
              .state('accounts.schools.index', {
                url : '',
                views : {
                  "schools-view" :
                      {templateUrl : "app/accounts/schools/index.html"}
                }
              });
        }
      ]);
})();
