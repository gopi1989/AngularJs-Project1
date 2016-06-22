'use strict'

describe('Directive: wepaFooter', function () {
  // load the directive's module
  beforeEach(module('wepaUI'))

  var element, scope

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new()
  }))

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<wepa-footer></wepa-footer>')
    element = $compile(element)(scope)
    expect(element.text()).toBe('')
  }))
})
