'use strict'

describe('LoginCtrl', function () {
  var scope, deferred, $location, session
  var fakeResponseSuccess = {data: {success: 'login success'}}

  beforeEach(module('wepaUI'))
  beforeEach(module('ngAnimate'))
  beforeEach(module('ngRoute'))
  beforeEach(module('wepaCore'))
  beforeEach(module('ngMaterial'))
  beforeEach(module('ngCookies'))
  beforeEach(module('datatables'))

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, wepaCore, _$q_, _$location_, _session_) {
    deferred = _$q_.defer()
    scope = $rootScope.$new()
    $location = _$location_
    session = _session_

    // Use a Jasmine Spy to return the deferred promise
    spyOn(wepaCore, 'login').and.returnValue(deferred.promise)

    // A simple mock to ensure the school list is never resolved and no real requests are made.
    spyOn(wepaCore, 'getSchoolList').and.returnValue(_$q_.defer().promise)

    $controller('LoginCtrl', {
      $scope: scope,
      wepaCore: wepaCore
    })
  }))

  it('loginAction method exists', function () {
    scope.pwd_password = 'formSubmitted'
    scope.txt_email = 'formSubmitted@gmail.com'

    scope.loginAction()

    expect(scope.pwd_password).toEqual('formSubmitted')
    expect(scope.txt_email).toEqual('formSubmitted@gmail.com')
  })

  it('Page redirect', function () {
    session.create('sds', 'sd', 'sdf')
    $location.path('/dashboard')
    scope.$apply()

    expect($location.path()).toBe('/dashboard')
  })

  it('should resolve promise on loginAction()', function () {
    $location.path('/dashboard')
    scope.loginAction()
    deferred.resolve(fakeResponseSuccess)
    scope.$apply()

    expect($location.path()).toBe('/dashboard')
  })
})
