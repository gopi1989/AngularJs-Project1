'use strict'

angular
  .module('wepaUI', [
    'templates',
    'prettyBytes',
    'ngAnimate',
    'ngMessages',
    'ngRoute',
    'wepaCore',
    'ngMaterial',
    'ngCookies',
    'datatables',
    'ngFileUpload',
    'checklist-model'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/login', {
        /* bind the login page content */
        templateUrl: 'login/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/release', {
        /* bind the release print page content*/
        templateUrl: 'release/release.html',
        controller: 'ReleaseCtrl',
        controllerAs: 'release'
      })
      .when('/dashboard', {
        /*  bind the dashboard page content */
        templateUrl: 'dashboard/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs: 'dashboard'
      })
      .when('/upload', {
        templateUrl: 'upload/upload.html',
        controller: 'UploadCtrl'
      })
      .otherwise({
        /*  bind the login page content */
        redirectTo: '/login'
      })
  })
