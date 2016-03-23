/**
 *
 * Guest Module Routes Accessible without authentication
 *
 */
(function() {
  'use strict';
  angular.module('learnerGuestsModule', [])
      .config([
        '$locationProvider',
        '$stateProvider',
        '$urlRouterProvider',
        function($locationProvider, $stateProvider, $urlRouterProvider) {
          var routeAccessAuthorization = {
            admin : {
              auth : function(Authentication) {
                return Authentication.userAccessAuthorization('admin');
              }
            },
            guest : {
              auth : function(Authentication) {
                return Authentication.userAlreadyLoggedIn();
              }
            },
            users : {
              auth : function(Authentication) {
                return Authentication.authroizeAccessForAuthenticatedUser();
              }
            }
          };
          $urlRouterProvider.otherwise("/");
          $stateProvider.state('guests',
                               {
                                 url : "/",
                                 templateUrl : "app/guests/guests.html",
                                 controller : 'GuestCtrl',
                                 abstract : true
                               })
              .state(
                  'guests.index',
                  {
                    url : '',
                    views :
                        {"guests" : {templateUrl : "app/guests/index.html"}}
                  })
              .state('guests.login',
                     {
                       url : 'login',
                       resolve : routeAccessAuthorization.guest,
                       views : {
                         guests : {
                           templateUrl : 'app/guests/login.html',
                           controller : 'LoginCtrl'
                         }
                       }
                     })
              .state('guests.forgot',
                     {
                       url : 'forgot',
                       resolve : routeAccessAuthorization.guest,
                       views :
                           {guests : {templateUrl : 'app/guests/forgot.html'}}
                     })
              .state(
                  'guests.reset',
                  {
                    url : 'reset/{token}',
                    resolve : routeAccessAuthorization.guest,
                    views : {guests : {templateUrl : 'app/guests/reset.html'}}
                  })
              .state('guests.register', {
                url : 'register',
                resolve : routeAccessAuthorization.guest,
                views : {
                  guests : {
                    templateUrl : 'app/guests/register.html',
                    controller : 'RegisterCtrl'
                  }
                }
              });
        }
      ])
      .controller(
          'GuestCtrl',
          [
            '$scope',
            function($scope) { $scope.title = 'Welcome To Adele\'s E-Learner'; }
          ])
      .controller(
          'LoginCtrl',
          [
            '$scope',
            '$location',
            'Toastr',
            'User',
            'Authentication',
            function($scope, $location, Toastr, User, Authentication) {
              $scope.errors = [];
              $scope.messages = [];
              $scope.user = {};
              if (Authentication.isAuthenticated()) {
                $location.path('/');
              }
              $scope.login = function userSignInFormSubmitted(form, username,
                                                              password) {
                if (form.$valid) {
                  Authentication.signIn(username, password)
                      .then(
                          function(user) {
                            Toastr.success("Congratulations!!!",
                                           username + ' You Are Logged In');
                            $location.path('/');
                          },
                          function(err) {
                            $scope.errors = [];
                            $scope.messages = [];
                            console.log(err);
                            $scope.errors.push(err.statusText);
                            if (err.data) {
                              if (err.data.error) {
                                $scope.errors.push(err.data.error);
                              }
                              if (err.data.errors) {
                                err.data.errors.forEach(function(e) {
                                  $scope.push(e);
                                });
                              }
                            }
                            var error = '<ul class="list">';
                            $scope.errors.forEach(function(err) {
                              error += '<li> ' + err + ' </li>';
                            });
                            error += '</ul>';
                            Toastr.error(error);

                          });
                } else {
                  $scope.errors = [];
                  $scope.messages = [];
                  $scope.errors.push(
                      'Form Submitted Is Invalid Please Fill In All The Fields Correctly');
                  var error = '<ul class="list">';
                  $scope.errors.forEach(function(err) {
                    error += '<li>' + err + '</li>';
                  });
                  error += '</ul>';
                  Toastr.error(error);
                }
              };
            }
          ])
      .controller('RegisterCtrl', [
        '$scope',
        '$location',
        'Toastr',
        'User',
        'Authentication',
        function($scope, $location, Toastr, User, Authentication) {
          $scope.errors = [];
          $scope.messages = [];
          $scope.user = {};
          $scope.user.agree = false;
          $scope.register = function registerFormSubmit(form, user) {
            if (form.$valid && $scope.user.agree) {
              Authentication.signUp($scope.user)
                  .then(
                      function(user) {
                        $scope.user = Authentication.getCurrentUser();
                        Toastr.success("Congratulations!!!",
                                       (user ? user.username : '') +
                                           ' You Have Registered');
                        $location.path('/');
                      },
                      function(err) {
                        console.log(err);
                        Toastr.error(
                            'error', "Error!!!",
                            'Registration Failed, User might Already Exist');
                      });

            } else {
              $scope.errors = [];
              $scope.messages = [];
              $scope.errors.push('Please Agree To The Terms And Conditions');
              $scope.errors.push(
                  'Form Submitted Is Invalid Please Fill In All The Fields Correctly');
              var error = '<ul class="list">';
              $scope.errors.forEach(function(err) {
                error += '<li>' + err + '</li>';
              });
              error += '</ul>';
              Toastr.error(error);
              // console.log(form);
              // console.log(user);
            }
          };
        }
      ]);
})();
