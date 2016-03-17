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
              '$location',
              '$state',
              'Authentication',
              'Toastr',
              function($scope, $location, $state, Authentication, Toastr) {
                $scope.getCurrentUser = Authentication.getCurrentUser;
                $scope.isAuthenticated = Authentication.isAuthenticated;
                $scope.isActive = function isActiveLink(name) {
                  return name === $state.current.name;
                };
                $scope.signOut = function singOutUser($event) {
                  $event.preventDefault();
                  Authentication.signOut().then(
                      function(res) {
                        $scope.username = "";
                        $scope.password = "";
                        Toastr.success('User Logged Out');
                        $location.path('/');
                      },
                      function(err) {
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
