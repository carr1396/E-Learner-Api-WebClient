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
                   'LocalStorageModule',
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
          $httpProvider.interceptors.push('leanerHTTPInterceptor');
        }
      ])
      .constant('Toastr', window.toastr);
})();
