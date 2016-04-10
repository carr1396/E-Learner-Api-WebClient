(function(){
  'use strict';
  angular.module('learnerApp')
  .factory('LeanerRequestQueue', ['$resource','APIBASEURL', 'Helpers', '$q',function($resource, APIBASEURL, Helpers, $q) {
    var _queue =$q.when();

    return function queueHTTPRequest(promisedRequest){
      var requestedRequest= function(value)
      {
        return promisedRequest;
      }
      return _queue.then(requestedRequest, requestedRequest);
    };
  }]);
})();
