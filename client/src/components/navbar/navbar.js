(function() {
  'use strict';
  angular.module('learnerApp')
      .directive('spiderNavbar', [
        function() {
          return {
            restrict : 'AE',
            replace : true,
            transclude : false,
            scope : {title : '@'},
            controller : [
              '$scope',
              '$rootScope',
              '$location',
              '$state',
              'Authentication',
              'Toastr',
              function($scope, $rootScope, $location, $state, Authentication,
                       Toastr) {
                $scope.getCurrentUser = Authentication.getCurrentUser;
                $scope.isAuthenticated = Authentication.isAuthenticated;
                $scope.isActive = function isActiveLink(name) {
                  return name === $state.current.name;
                };
                $scope.signOut = function singOutUser($event) {
                  $event.preventDefault();
                  Authentication.signOut().then(
                      function() {
                        $scope.username = "";
                        $scope.password = "";
                        Toastr.success('User Logged Out');
                        $location.path('/');
                      },
                      function() {
                        Toastr.error(
                            "Error!!!",
                            'Something Went Wrong While Logging Out User');
                        $location.path('/');
                      });

                };
                var i = 0;
                $scope.navClass = function(page) {
                  var currentRoute =
                      $location.path().substring(1).split('/')[0];
                  return page === currentRoute ? 'active' : '';
                };
                $rootScope.$on('token_expired', function(event) {
                  Authentication.authenticateUser(null, null);
                  $scope.getCurrentUser = Authentication.getCurrentUser;
                  $scope.isAuthenticated = Authentication.isAuthenticated;
                });
                $scope.routes = [];
                $scope.links = [];
                for (; i < $scope.routes.length; i++) {
                  if ($scope.isAuthenticated()) {
                    if ($scope.routes[i].auth) {
                      $scope.links.push($scope.routes[i]);
                    }
                  } else if (!$scope.isAuthenticated()) {
                    if (!$scope.routes[i].auth) {
                      console.log($scope.routes[i].auth);
                      $scope.links.push($scope.routes[i]);
                    }
                  }
                }
                $scope.isCollapsed = true;

              }
            ],
            templateUrl : '/app/components/navbar/navbar.html'
          };
        }
      ]);
})();
