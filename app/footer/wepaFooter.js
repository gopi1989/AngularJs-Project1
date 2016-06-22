'use strict'

angular.module('wepaUI')
  .directive('wepaFooter', function () {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'footer/footer.html'
    }
  })
