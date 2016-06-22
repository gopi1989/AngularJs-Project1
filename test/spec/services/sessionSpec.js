'use strict'

describe('Service: session', function () {
  // load the service's module
  beforeEach(module('wepaUI'))

  // instantiate service
  var session
  beforeEach(inject(function (_session_) {
    session = _session_
  }))

  it('should session method exists', function () {
    expect(!!session).toBe(true)
  })

  it('should call create()', function () {
    session.create('name', 'name')
    expect(session.authToken).toBe('name')
  })

  it('should call destroy()', function () {
    session.destroy()
  })
})
