(function() {
  'use strict';
  angular.module('learnerApp')
      .directive('spiderTable', function factory() {
        var directiveDefinitionObject = {

          compile : function compile(tElement, tAttrs, transclude) {

            return function(scope, element, attrs) {

            }
          }
        };
        return directiveDefinitionObject;
      })
})();
