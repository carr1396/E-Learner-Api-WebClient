'use strict';
(function() {
  angular.module('learnerApp')
      .controller('GuestCtrl', [
        '$scope',
        function($scope) { $scope.title = 'Welcome To E-Learner Online'; }
      ]);
})();
