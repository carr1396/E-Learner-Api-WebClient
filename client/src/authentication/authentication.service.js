(function(){
  'use strict';
  angular.module('learnerApp').
  factory('Authentication', ['Toastr', '$q', '$http', '$window', 'localStorageService', 'User',
    function(
      Notification,
      $q, $http, $window,localStorageService, User) {
      var currentUser = null;
      if (!!$window.CurrentBootstrappedUser) {
        var user = new User();
        angular.extend(user, $window.CurrentBootstrappedUser);
        currentUser = user;
      }
      $
      var Authentication = {
        getCurrentUser: function getCurrentLoggedInUser() {
          return currentUser;
        },
        authenticateUser: function authenticateUser(user, token) {
          if(token)
          {
            localStorageService.set('_token', token);
          }else{
            localStorageService.remove('_token');
          }
          currentUser = user;
        },
        signOut: function singOutUser() {
          Authentication.authenticateUser(null, null);
          return $http.post('/logout', {
            logOut: true
          });
        },
        signIn: function singInUser(username, password) {
          var defered = $q.defer();
          $http.post('/login', {
            username: username,
            password: password
          }).then(function(res) {
            var user = new User();
            angular.extend(user, res.data.user);
            Authentication.authenticateUser(user, res.data.token);
            defered.resolve(res.data.user);
          }, function(err) {
            defered.reject(err);
          });
          return defered.promise;
        },
        signUp: function singUpUser(nuser) {
          var user = new User(nuser);
          var defered = $q.defer();
          $http.post('/register', nuser).then(function(res) {
            angular.extend(user, res.data.user);
            Authentication.authenticateUser(user, res.data.token);
            defered.resolve(res.data.user);
          }, function(err) {
            defered.reject(err);
          });
          return defered.promise;
        },
        registerUser: function singUpUser(nuser) {
          var user = new User(nuser);
          var defered = $q.defer();
          user.$save().then(function(res) {
            Authentication.authenticateUser(user, res.data.token);
            defered.resolve(res);
          }, function(err) {
            // console.log(err);
            defered.reject(err);
          });
          return defered.promise;
        },
        update: function UpdateUser(nuser) {
          var user = Authentication.getCurrentUser();
          angular.extend(user, nuser);
          var defered = $q.defer();
          user.$update().then(function(res) {
            Authentication.authenticateUser(user, user);
            defered.resolve(res);
          }, function(err) {
            // console.log(err);
            defered.reject(err);
          });
          return defered.promise;
        },
        isAuthorized: function isCurrenttUserAuthorized(role) {
          return !!Authentication.getCurrentUser() && Authentication.getCurrentUser()
            .hasRole(role);
        },
        isAuthorizedWithRoles: function isCurrenttUserAuthorized(roles) {
          var hasRole = false;
          for (var i = 0; i < roles.length; i++) {
            if(Authentication.getCurrentUser().hasRole(roles[i]))
              {
                hasRole =true;
                break;
              }
          }
          return !!Authentication.getCurrentUser() && hasRole;
        },
        userAccessAuthorization: function userAccessAuthorization(role) {
          if (Authentication.isAuthorized(role)) {
            return true;
          } else {
            toastr.error('Access Denied', 'You Tried To Access A Page You Are Not Authorized To See');
            return $q.reject('Not Authorized');

          }
        },
        userAccessAuthorizationIfEither: function userAccessAuthorization(roles) {
          if (Authentication.isAuthorizedWithRoles(roles)) {
            return true;
          } else {
            toastr.error('Access Denied', 'You Tried To Access A Page You Are Not Authorized To See');
            return $q.reject('Not Authorized');

          }
        },
        userAlreadyLoggedIn: function userAlreadyLoggedIn() {
          if (!Authentication.isAuthenticated()) {
            return true;
          } else {
            toastr.error('Access Denied', 'You Are Already Logged In');
            return $q.reject('AlreadyLoggedIn');
          }
        },
        authroizeAccessForAuthenticatedUser: function authroizeAccessForAuthenticatedUser() {
          if (Authentication.isAuthenticated()) {
            return true;
          } else {
            toastr.error('Access Denied', 'You Tried To Access A Page You Are Not Authorized To See');
            return $q.reject('NotAuthorized');
          }
        },
        isAuthenticated: function isCurrenttUserAuthenticated() {
          return !!Authentication.getCurrentUser();
        }
      };
      return Authentication;
    }
  ]).factory('leanerHTTPInterceptor', ['$log','localStorageService', '$rootScope',
  'Toastr', '$location', function($log, localStorageService, $rootScope, Toastr,  $location) {
    var Interceptor = {
      request : function(config) {
        var access_token = localStorageService.get('_token') ? localStorageService.get('_token') : null;
        if (access_token) {
            config.headers.authorization = 'Bearer '+access_token;
        }
        return config;
    },
    responseError: function(response) {
      //http://onehungrymind.com/winning-http-interceptors-angularjs/
      if (response.status === 440) {
            $rootScope.$broadcast('token_expired');
            Toastr.error('Error!!!', 'Token Expired Or Invalid Logging Out');
            localStorageService.remove('_token');
            window.CurrentBootstrappedUser = null;
            $location.path('/');
        }
        return response;
    }

    };

    return Interceptor;
}]);
})();
