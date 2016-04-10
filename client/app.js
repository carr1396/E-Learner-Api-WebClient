'use strict';
(function() {
  // toastr options
  window.toastr.options.showMethod = 'slideDown';
  window.toastr.options.hideMethod = 'slideUp';
  window.toastr.options.closeMethod = 'slideUp';
  angular.module('learnerApp',
                 [
                   'ui.router',
                   'ngResource',
                   'ui.bootstrap',
                   'LocalStorageModule',
                   'isteven-multi-select',
                   'angular-multi-check',
                   'ui.validate',
                   'learnerGuestsModule',
                   'leanerAccountModule'
                 ])
      .config([
        '$locationProvider',
        'localStorageServiceProvider',
        '$httpProvider',
        function($locationProvider, localStorageServiceProvider,
                 $httpProvider) {
          $locationProvider.html5Mode(false);
          localStorageServiceProvider.setPrefix('e_leaner_2015_11000021');
          localStorageServiceProvider.setStorageType('localStorage');
          localStorageServiceProvider.setNotify(true, true);
          $httpProvider.defaults.useXDomain = true;
          $httpProvider.interceptors.push('leanerHTTPInterceptor');
        }
      ])
      .run([
        '$rootScope',
        '$location',
        function($rootScope, $location) {
          $rootScope.$on('$routeChangeError',
                         function(e, curr, prev, rejection) {
                           if (rejection === 'NotAuthorized' ||
                               rejection === 'AlreadyLoggedIn') {
                             $location.path('/');
                           }
                         });
        }
      ])
      .constant('Toastr', window.toastr)
      .constant('APIBASEURL', '/api/v1');
})();
