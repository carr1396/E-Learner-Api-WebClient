(function() {
  'use strict';
  angular.module('leanerAccountAdministrationSchoolModule', [])
      .config([
        '$locationProvider',
        '$stateProvider',
        function($locationProvider, $stateProvider) {
          var routeAccessAuthorization = {
            admin : {
              auth : function(Authentication) {
                return Authentication.userAccessAuthorizationIfEither(
                    [ 'admin', 'superadmin' ]);
              }
            }
          };
          $stateProvider.state(
                            'accounts.admin.schools',
                            {
                              url : '/schools',
                              abstract : true,
                              views : {
                                "administration" : {
                                  templateUrl :
                                      "app/accounts/admin/schools/schools.html",
                                  controller : 'SchoolAdminCtrl'
                                }
                              }
                            })
              .state('accounts.admin.schools.index',
                     {
                       url : '',
                       views : {
                         "schools" : {
                           templateUrl : "app/accounts/admin/schools/index.html"
                         }
                       }
                     })
              .state('accounts.admin.schools.edit',
                     {
                       url : '/:schoolId/edit',
                       abstract : true,
                       views : {
                         "schools" : {
                           templateUrl :
                               "app/accounts/admin/schools/edit/edit.html",
                           controller : 'SchoolAdminEditCtrl'
                         }
                       }
                     })
              .state('accounts.admin.schools.edit.profile',
                     {
                       url : '/profile',
                       views : {
                         "schoolsEditView" : {
                           templateUrl :
                               "app/accounts/admin/schools/edit/profile.html",
                           controller : 'SchoolAdminEditCtrl'
                         }
                       }
                     })
              .state('accounts.admin.schools.edit.api',
                     {
                       url : '/api',
                       views : {
                         "schoolsEditView" : {
                           templateUrl :
                               "app/accounts/admin/schools/edit/api.html",
                           controller : 'SchoolAdminEditAPICtrl'
                         }
                       }
                     })
              .state(
                  'accounts.admin.schools.edit.registration',
                  {
                    url : '/registration',
                    abstract : true,
                    views : {
                      "schoolsEditView" : {
                        templateUrl :
                            "app/accounts/admin/schools/edit/registration/registration.html",
                        controller : 'SchoolAdminEditAPICtrl'
                      }
                    }
                  })
              .state(
                  'accounts.admin.schools.edit.registration.index',
                  {
                    url : '/index',
                    views : {
                      "schoolRegistration" : {
                        templateUrl :
                            "app/accounts/admin/schools/edit/registration/index.html"
                      }
                    }
                  })
              .state(
                  'accounts.admin.schools.edit.registration.api',
                  {
                    url : '/api',
                    views : {
                      "schoolRegistration" : {
                        templateUrl :
                            "app/accounts/admin/schools/edit/registration/api.html"
                      }
                    }
                  })
              .state('accounts.admin.schools.edit.registration.manual', {
                url : '/manual',
                views : {
                  "schoolRegistration" : {
                    templateUrl :
                        "app/accounts/admin/schools/edit/registration/manual.html"
                  }
                }
              });
        }
      ])
      .controller(
          'SchoolAdminCtrl',
          [
            '$scope',
            'Authentication',
            'School',
            '$state',
            '$stateParams',
            function($scope, Authentication, School, $state, $stateParams) {
              $scope.getCurrentUser = Authentication.getCurrentUser;
              $scope.schools = School.mine({id : 'me'});
              $scope.refreshSchools = function refreshSchools() {
                $scope.schools = School.mine({id : 'me'});
              };

            }
          ])
      .controller(
          'SchoolAdminEditCtrl',
          [
            '$scope',
            'Authentication',
            'School',
            '$state',
            '$stateParams',
            'Toastr',
            function($scope, Authentication, School, $state, $stateParams,
                     Toastr) {
              $scope.getCurrentUser = Authentication.getCurrentUser;
              if ($state.params.schoolId) {
                $scope.school =
                    $scope.school || School.get({id : $state.params.schoolId});
              }
              function displayErrors(err) {
                $scope.errors = [];
                $scope.messages = [];
                if (err.statusText) {
                  $scope.errors.push(err.statusText);
                }
                if (err.message) {
                  $scope.errors.push(err.message);
                }
                if (err.data) {
                  if (err.data.error) {
                    $scope.errors.push(err.data.error);
                  }
                  if (err.data.errors) {
                    err.data.errors.forEach(function(e) { $scope.push(e); });
                  }
                }
                if (err.error) {
                  if (err.error) {
                    $scope.errors.push(err.error);
                  }
                  if (err.errors) {
                    err.errors.forEach(function(e) { $scope.errors.push(e); });
                  }
                }
                var error = '<ul class="list">';
                $scope.errors.forEach(function(err) {
                  error += '<li> ' + err + ' </li>';
                });
                error += '</ul>';
                Toastr.error(error);
              }

              $scope.editThisSchool = function onEditSchoolFormSubmitted(form) {
                if (form.$valid) {
                  $scope.school.$update().then(function(res) {
                    if (res.error) {
                      displayErrors(res);
                    } else {
                      Toastr.success('Success!!',
                                     'Your School Profile Has Been Updated')
                    }
                  });
                } else {
                  Toastr.error('Error!!', 'Form Is Innvalid');
                }
              };
            }
          ])
      .controller('SchoolAdminEditAPICtrl', [
        '$scope',
        'Authentication',
        'School',
        '$state',
        '$stateParams',
        function($scope, Authentication, School, $state, $stateParams) {
          $scope.getCurrentUser = Authentication.getCurrentUser;
          if ($state.params.schoolId) {
            $scope.school =
                $scope.school || School.get({id : $state.params.schoolId});
          }
        }
      ]);
})();
