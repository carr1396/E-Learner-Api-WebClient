'use strict';
(function() {
  angular.module('learnerApp', [ 'ui.router', 'ngResource' ])
      .config([
        '$locationProvider',
        '$stateProvider',
        '$urlRouterProvider',
        function($locationProvider, $stateProvider, $urlRouterProvider) {
          $locationProvider.html5Mode(false);
          $urlRouterProvider.otherwise("/");
          $stateProvider.state('guest', {
            url : "/",
            templateUrl : "app/guests/guests.html",
            controller : 'GuestCtrl'
          });
        }
      ]);
})();
