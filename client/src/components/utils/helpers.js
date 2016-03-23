(function() {
  'use strict';
  angular.module('learnerApp')
      .service('Helpers', [
        function() {
          return {
            capitalizeFirstLetter : function capitalizeFirstLetter(string) {
              return string.charAt(0).toUpperCase() + string.slice(1);
            }
          };
        }
      ]);
})();
