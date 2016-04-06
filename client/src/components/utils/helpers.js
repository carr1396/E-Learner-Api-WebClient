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
              return strA.indexOf(strB) !== -1;
            },
            convertStringToTitleCase : function convertStringToTitleCase(str) {
              return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() +
                       txt.substr(1).toLowerCase();
              });
            },
            displayErrors : function displayErrors(ctx, err, logger) {
              ctx.errors = [];
              ctx.messages = [];
              if (err.statusText) {
                ctx.errors.push(err.statusText);
              }
              if (err.message) {
                ctx.errors.push(err.message);
              }
              if (err.data) {
                if (err.data.error) {
                  ctx.errors.push(err.data.error);
                }
                if (err.data.errors) {
                  err.data.errors.forEach(function(e) { ctx.push(e); });
                }
              }
              if (err.error) {
                if (err.error) {
                  ctx.errors.push(err.error);
                }
                if (err.errors) {
                  err.errors.forEach(function(e) { ctx.errors.push(e); });
                }
              }
              var error = '<ul class="list">';
              ctx.errors.forEach(function(err) {
                error += '<li> ' + err + ' </li>';
              });
              error += '</ul>';
              logger.error(error, 'Error!!');
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
