'use strict'

describe('Controller: UploadCtrl', function () {
  // load the controller's module
  beforeEach(module('wepaUI'))

  var scope, deferred, $mdDialog
  var fakeResponseSuccess = {firstName: 'foo', lastName: 'foo'}
  var fakeReleaseSuccess = {status: 'READY_FOR_PRINT', lastName: 'foo'}
  var fakeResponseError = {data: {error: 'foo'}}
  var fakeFile = ['file']

  beforeEach(module('ngAnimate'))
  beforeEach(module('ngRoute'))
  beforeEach(module('wepaCore'))
  beforeEach(module('ngMaterial'))
  beforeEach(module('ngCookies'))
  beforeEach(module('datatables'))

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$q_, wepaCore, _$mdDialog_) {
    deferred = _$q_.defer()
    scope = $rootScope.$new()
    $mdDialog = _$mdDialog_
    spyOn(wepaCore, 'uploadFile').and.returnValue(deferred.promise)
    spyOn(wepaCore, 'getUserInfo').and.returnValue(deferred.promise)
    spyOn(wepaCore, 'getFileStatus').and.returnValue(deferred.promise)
    spyOn($mdDialog, 'show').and.returnValue(deferred.promise)
    $controller('UploadCtrl', {
      $scope: scope,
      wepaCore: wepaCore
    })
  }))

  it('should call getFileDetails method', function () {
    scope.potrait()
    scope.landscape()
    scope.printcolor()
    scope.printbw()
    scope.singleside()
    scope.doubleside()
  })

  it('should resolve promise on getUserDetails()', function () {
    scope.getUserDetails()
    deferred.resolve(fakeResponseSuccess)
    scope.$apply()
    expect(scope.succResponse).not.toBe(undefined)
    expect(scope.succResponse).toBe(fakeResponseSuccess)
  })

  it('should reject promise getUserDetails()', function () {
    scope.getUserDetails()
    deferred.reject(fakeResponseError)
    scope.$apply()
    expect(scope.errorResponse).not.toBe(undefined)
    expect(scope.errorResponse).toBe(fakeResponseError)
  })

  it('should reject promise on upload()', function () {
    scope.upload(fakeFile)
    deferred.reject(fakeResponseError)
    scope.$apply()
    expect(scope.errorResponse).not.toBe(undefined)
    expect(scope.errorResponse).toBe(fakeResponseError)
  })

  it('should resolve promise on upload()', function () {
    scope.orientation = 'foo'
    scope.copies = 'foo'
    scope.printRangeStart = 'foo'
    scope.printRangeEnd = 'foo'
    scope.checkboxModelvalue = 'foo'
    scope.print = ''

    scope.upload(fakeFile)
    deferred.resolve(fakeResponseSuccess)
    scope.$apply()

    expect(scope.succResponse).not.toBe(undefined)
    expect(scope.succResponse).toBe(fakeResponseSuccess)
  })

  it('should resolve promise on calReleaseCode()', function () {
    scope.calReleaseCode()
    deferred.resolve(fakeReleaseSuccess)
    scope.$apply()

    expect(scope.succResponse).not.toBe(undefined)
    expect(scope.succResponse).toBe(fakeReleaseSuccess)
  })

  it('should resolve promise on calReleaseCode()', function () {
    scope.calReleaseCode()
    deferred.resolve(fakeResponseSuccess)
    scope.$apply()

    expect(scope.succResponse).not.toBe(undefined)
    expect(scope.succResponse).toBe(fakeResponseSuccess)
  })

  it('should reject promise calReleaseCode()', function () {
    scope.calReleaseCode()
    deferred.reject(fakeResponseSuccess)
    scope.$apply()

    expect(scope.succResponse).not.toBe(undefined)
    expect(scope.succResponse).toBe('')
  })

  it('should call calReleaseCode()', function () {
    scope.callCount = 7
    scope.calReleaseCode()
    scope.$apply()

    expect(scope.callCount > 5).toBe(true)
  })
})
