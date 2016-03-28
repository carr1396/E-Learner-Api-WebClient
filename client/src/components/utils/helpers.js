(function() {
  'use strict';
  angular.module('learnerApp')
      .service('Helpers', [
        function() {
          return {
            capitalizeFirstLetter : function capitalizeFirstLetter(string) {
              return string.charAt(0).toUpperCase() + string.slice(1);
            },
            stringAContainsB : function ifStringAContainsB(strA, strB) {
              return strA.indexOf(strB) != -1;
            },
            convertStringToTitleCase : function convertStringToTitleCase(str) {
              return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() +
                       txt.substr(1).toLowerCase();
              });
            },
            convertStringToSentenceCase : function convertStringToSentenceCase(
                str) {
              var rg = /(^\w{1}|\.\s*\w{1})/gi;
              return str.replace(
                  rg, function(toReplace) { return toReplace.toUpperCase(); });
            }
          };
        }
      ]);
})();
