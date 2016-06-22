'use strict'

describe('Controller: DashboardCtrl', function () {
  // load the controller's module
  beforeEach(module('wepaUI'))

  var scope, deferred, session
  var FAKE_RESPONSE = {data: {succes: 'foo'}}

  beforeEach(module('ngAnimate'))
  beforeEach(module('ngRoute'))
  beforeEach(module('wepaCore'))
  beforeEach(module('ngMaterial'))
  beforeEach(module('ngCookies'))
  beforeEach(module('datatables'))

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$q_, wepaCore, _session_) {
    deferred = _$q_.defer()
    scope = $rootScope.$new()
    session = _session_
    spyOn(wepaCore, 'getFileList').and.returnValue(deferred.promise)
    spyOn(wepaCore, 'getUserInfo').and.returnValue(deferred.promise)

    $controller('DashboardCtrl', {
      $scope: scope,
      wepaCore: wepaCore
    })
  }))

  it('should call isAuthenticated()', function () {
    spyOn(session, 'isAuthenticated').and.returnValue(true)
    scope.getFileDetails()
    deferred.resolve(FAKE_RESPONSE)
    window.innerWidth = 9000
    scope.$apply()
    expect(scope.printlist).not.toBe(undefined)
    expect(scope.printlist).toBe(FAKE_RESPONSE)
  })

  it('should resolve promise on getUserName()', function () {
    scope.getUserName()
    deferred.resolve(FAKE_RESPONSE)
    scope.$apply()
    expect(scope.succResponse).toBe(FAKE_RESPONSE)
  })

  it('should call upload  method', function () {
    scope.upload()
  })
})
