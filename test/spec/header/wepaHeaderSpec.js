/* eslint-env jasmine */
/* global inject */
describe('wepaHeader', function () {
  beforeEach(module('wepaUI'))

  var scope

  beforeEach(inject(function ($rootScope, $compile, $httpBackend) {
    // Mock the template.
    $httpBackend.whenGET('header/header.html').respond(200, '<div></div>')

    var element = $compile('<div wepa-header></div>')($rootScope.$new())
    // Respond to angular trying to get the template.
    $httpBackend.flush()
    // Execute directive controller and link methods.
    $rootScope.$digest()

    scope = element.isolateScope()
  }))

  describe('isAuthenticated', function () {
    it('should check session.isAuthenticated', inject(function (session) {
      spyOn(session, 'isAuthenticated').and.returnValue(true)

      expect(scope.isAuthenticated()).toBe(true)
      expect(session.isAuthenticated).toHaveBeenCalled()
    }))
  })

  describe('signOut', function () {
    beforeEach(inject(function ($location, session) {
      spyOn(session, 'destroy')
      spyOn($location, 'path')

      scope.signOut()
    }))

    it('should destroy session', inject(function (session) {
      expect(session.destroy).toHaveBeenCalled()
    }))

    it('redirect to login', inject(function ($location) {
      expect($location.path).toHaveBeenCalledWith('/login')
    }))
  })
})
