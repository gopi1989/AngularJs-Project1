'use strict'

angular.module('wepaUI')
  .directive('wepaHeader', function () {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'header/header.html',
      scope: {},
      controller: function ($scope, $location, $window, session) {
        $scope.isAuthenticated = function () {
          return session.isAuthenticated()
        }

        $scope.signOut = function () {
          session.destroy()
          $location.path('/login')
          $window.location.reload();
        }
      }
    }
  })
