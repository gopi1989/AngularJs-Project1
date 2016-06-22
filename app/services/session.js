'use strict'

angular.module('wepaUI')
  .service('session', function () {

      this.release = []
    /**
     * @desc: This method is responsible for create new login session
     **/
    this.create = function (authToken, userId) {
      this.authToken = authToken
      this.userId = userId
    }

    /**
     * @desc: This method is responsible for destroy user login session
     **/
    this.destroy = function () {
      this.authToken = null
      this.userId = null
      this.userPass = null
    }

    /**
     * @desc: This method is responsible for return current user login status (true or false).
     **/
    this.isAuthenticated = function () {
      return this.userId != null
    }

    /**
     * @desc: This method is responsible for return Access Token of current user.
     **/
    this.getAuthTokenFromCookie = function () {
      return this.authToken
    }

    /**
     * @desc: This method is responsible for return select printfile Array of current user.
     **/
    this.putPrintfile = function (releasefile) {
        console.log('PUT')
        console.log(releasefile)
        this.release.push(releasefile)
    }

    this.getPrintfile = function () {
        console.log('GET')
        console.log(this.release)
      return this.release
    }

    this.putFilename = function (filename) {
      this.filename = filename
    }

    this.getFilename = function () {
      return this.filename
    }
  })
