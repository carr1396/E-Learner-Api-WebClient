(function() {
  'use strict';
  angular.module('learnerApp')
      .directive(
          'spiderDashboard',
          [
            function spiderDashboardFactory() {
              var template = [
                '<div class="dashboard">',
                '<div class="dashboard-panel dashboard-menu" ng-transclude ng-transclude-slot="spiderDashboardMenu">',
                'Menu',
                '</div>',
                '<div class="dashboard-panel dashboard-content"> ',
                '<div class="dashboard-bar"   ng-transclude ng-transclude-slot="spiderDashboardBar"></div>',
                '<div class="dashboard-main-content"   ng-transclude ng-transclude-slot="spiderDashboardContent"></div>',
                '</div>',
                '</div>'
              ].join('');
              var spiderDashboardCtrl =
                  [ function spiderDashboardCtrl() { var db = this; } ];
              var link = function linkFactoryFunction(
                  scope, el, atts, dashboardCtrl, transclude) {
                // console.log(dashboardCtrl);
              };
              var directiveDefinitionObject = {
                restrict : 'E',
                transclude : {
                  spiderDashboardMenu : 'spiderDashboardMenu',
                  spiderDashboardContent : 'spiderDashboardContent',
                  spiderDashboardBar : '?spiderDashboardBar'
                },
                replace : true,
                controller : spiderDashboardCtrl,
                controllerAs : 'db',
                bindToController : true, template : template,
                link : link
              };
              return directiveDefinitionObject;
            }
          ])
      .directive(
          'spiderDashboardMenu',
          function factory() {
            var template = [
              '<nav class="spider-dashboard-nav">',
              '<a class="dashboard-header" ui-sref="{{::db.currentLocation}}"',
              'uib-tooltip="{{::db.acountType}}" tooltip-placement="auto left">',
              '<span class="fa fa-3x fa-user"></span>',
              '</a>',
              '<ul class="nav">',
              '<li ui-sref-active="active">',
              '<a ui-sref="{{::db.currentLocation}}" uib-tooltip="Home" tooltip-placement="auto left">',
              '<span class="fa fa-2x fa-home"></span>',
              '</a>',
              '</li>',
              '<li ui-sref-active="active" ng-repeat="link in db.routes">',
              '<a ui-sref="{{link.name?link.name:link.url}}" uib-tooltip="{{link.text}}" tooltip-placement="auto left">',
              '<span class="fa fa-2x fa-{{link.icon?link.icon:db.defaultLinkIcon}}"></span>',
              '</a>',
              '</li>',
              '</ul>',
              '</nav>'
            ].join('');
            var link = function linkFactoryFunction(scope, el, atts, ctrl,
                                                    transclude) {};
            var spiderDashboardMenuCtrl = [
              function spiderDashboardCtrl() {
                var db = this;
                db.currentLocation = "accounts.index";
                db.acountType = "Admin";
                db.defaultLinkIcon = "link";
                // console.log(db.routes);
              }
            ];
            var directiveDefinitionObject = {
              restrict : 'E',
              require : '^spiderDashboard',
              replace : true,
              scope : {routes : "="},
              controller : spiderDashboardMenuCtrl,
              controllerAs : 'db',
              bindToController : true, template : template,
              link : link
            };
            return directiveDefinitionObject;
          })
      .directive('spiderDashboardContent',
                 function factory() {
                   var template =
                       [ '<div ng-transclude class="wrapper">', '</div>' ].join(
                           '');
                   var link = function linkFactoryFunction(
                       scope, el, atts, dashboardCtrl, transclude) {};
                   var spiderDashboardContentCtrl =
                       [ function spiderDashboardCtrl() { var db = this; } ];
                   var directiveDefinitionObject = {
                     restrict : 'E',
                     transclude : true,
                     require : '^spiderDashboard',
                     replace : true,
                     controller : spiderDashboardContentCtrl,
                     controllerAs : 'db',
                     bindToController : true, template : template
                   };
                   return directiveDefinitionObject;
                 })
      .directive('spiderDashboardBar', function factory() {
        var template =
            [ '<div ng-transclude class="wrapper">', '</div>' ].join('');
        var link = function linkFactoryFunction(scope, el, atts, dashboardCtrl,
                                                transclude) {};
        var spiderDashboardBarCtrl =
            [ function spiderDashboardCtrl() { var db = this; } ];
        var directiveDefinitionObject = {
          restrict : 'E',
          transclude : true,
          require : '^spiderDashboard',
          replace : true,
          controller : spiderDashboardBarCtrl,
          controllerAs : 'db',
          bindToController : true, template : template
        };
        return directiveDefinitionObject;
      });
})();
