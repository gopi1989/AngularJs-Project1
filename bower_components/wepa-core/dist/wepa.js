(function () {
"use strict";


wepaCoreService.$inject = ['wepaCoreAuth', 'wepaCoreApi', 'wepaCoreUpload', 'wepaCoreSchool', 'wepaCoreRemoteRelease'];angular.module('wepaCore', [])
  .service('wepaCore', wepaCoreService)

/**
 * The main service of the wepa Angular core.
 * This service defines the public API of the library.
 * For docs on how to change config please refer to [`wepaCoreConfigProvider`](config.md).
 *
 * @class
 * @public
 *
 * @example
 * angular.module('app', ['wepaCore'])
 *   .controller('MyController', function (wepaCore) {
 *     this.login = function (username, password) {
 *       wepaCore.login(username, password).then(function () {
 *         alert('Logged in!')
 *       }, function () {
 *         alert('Error!')
 *       })
 *     }
 *   })
 */
function wepaCoreService (wepaCoreAuth, wepaCoreApi, wepaCoreUpload, wepaCoreSchool, wepaCoreRemoteRelease) {
  /**
   * Authenticates a user by their email and password and obtains an access token.
   * The token is automatically stored and used in subsequent API calls. You
   * probably don't need to use it yourself.
   *
   * @param {string} email Email of a wepa user
   * @param {string} password Password of a wepa user in plain text
   *
   * @return {Promise} Resolves with an access token or rejects with an error from the API server.
   **/
  this.login = function (email, password) {
    return wepaCoreAuth.auth(email, password)
  }

  /**
   * Fetches the current user details.
   *
   * @return {Promise} Resolves with information about the current user. See section "User Details" here: {@link https://api.wepanow.com/docs/users.htm}
   **/
  this.getUserInfo = function () {
    return wepaCoreApi.makeApiCall('/resources/users/user/')
  }

  /**
   * Fetches a list of files in print queue for the current user.
   *
   * @return {Promise} Resolves with the list of files. See section "Status" here: {@link https://api.wepanow.com/docs/files.htm}
   **/
  this.getFileList = function () {
    return wepaCoreApi.makeApiCall('/resources/files/')
  }

  /**
   * Uploads a file to the print server.
   *
   * @param {File|Blob} file The file represented as a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects) or a `Blob` object.
   * @param {string} filename The name of the file
   * @param {Object} printOptions See {@link https://api.wepanow.com/docs/files.htm} for a list of available print options.
   *
   * @return {Promise} Resolves with upload status.
   **/
  this.uploadFile = function (file, filename, printOptions) {
    return wepaCoreUpload.upload(file, filename, printOptions)
  }

  /**
   * Fetches information about an uploaded file.
   *
   * @param {number|string} fileId ID of a file. Returned as `fileRefId` after a successfull upload vie `uploadFile`.
   *
   * @return {Promise} Resolves with file info. See section "Status" here: {@link https://api.wepanow.com/docs/files.htm}
   **/
  this.getFileStatus = function (fileId) {
    return wepaCoreApi.makeApiCall('/resources/files/' + fileId)
  }

  /**
   * Fetches the list of all supported schools (groups).
   *
   * Automatically authenticates with client credentials if needed.
   *
   * @return {Promise} Resolves with the list of schools
   **/
  this.getSchoolList = function () {
    return wepaCoreSchool.getList()
  }

  /**
   * Checks whether a school supports shibboleth or password-based auth.
   *
   * @return {boolean} `true` if the school supports shibboleth auth, `false` otherwise
   **/
  this.isShibSchool = function (school) {
    return wepaCoreSchool.isShib(school)
  }

  /**
   * Gets a list of available remote release stations.
   *
   * @param {Array} keyList A list that contains ADA keys or beacon IDs
   *
   * @return {Promise} Resolves with a list of stations associated with the specified IDs
   */
  this.getRemoteReleaseStationList = function (keyList) {
    return wepaCoreRemoteRelease.getStationList(keyList)
  }

  /**
   * Submits a file prepared for print to be printed (remotely released) on a station.
   *
   * @param {Object} station The station object obtained from `getRemoteReleaseStationList`
   * @param {string} releaseCode Release code of the file to be printed
   *
   * @return {Promise} Resolves with status from the API
   */
  this.submitRemoteRelease = function (station, releaseCode) {
    return wepaCoreRemoteRelease.submit(station, releaseCode)
  }

  /**
   * Cancels a submitted remote release job.
   *
   * @param {string} transactionId ID of the transaction returned by the API when submitting a remote release job
   *
   * @return {Promise} Resolves with response from the API
   */
  this.cancelRemoteRelease = function (transactionId) {
    return wepaCoreRemoteRelease.cancel(transactionId)
  }

  /**
   * Fetches status information of a submitted remote release job.
   *
   * @param {string} transactionId ID of the transaction returned by the API when submitting a remote release job
   *
   * @return {Promise} Resolves with status of the specified job
   */
  this.getRemoteReleaseStatus = function (transactionId) {
    return wepaCoreRemoteRelease.getStatus(transactionId)
  }
}


apiService.$inject = ['$q', '$http', 'wepaCoreConfig', 'wepaCoreErrorMessages'];angular.module('wepaCore')
  .service('wepaCoreApi', apiService)

/**
 * @class
 */
function apiService ($q, $http, wepaCoreConfig, wepaCoreErrorMessages) {
  this.defaultAuthHeader = ''

  /**
   * Makes a call to [wepa API](https://api.wepanow.com).
   *
   * @param {string} endpoint API endpoint name: `/resources/files/upload`, etc.
   * @param {Object} [params] GET query params
   * @param {Object} [options={}] Additional options
   * @param {string} [options.method=GET] The method of the underlying HTTP request.
   * Automatically set to `POST` when `options.data` is present
   * @param {string} [options.data] POST data to send with the underlying HTTP
   * request. Files should be wrapped into `FormData`
   * @param {string} [options.authHeader=Bearer [token]]  `Authorization` HTTP
   * header. Call `wepaCoreApi.auth` before this method to populate the default access token
   * @param {string} [options.contentType=application/x-www-form-urlencoded]
   * `Content-Type` HTTP header
   *
   * @return {Promise} Resolves with a response from the API server.
   */
  this.makeApiCall = function (endpoint, params, options) {
    options = options || {}

    var httpOptions = {
      method: options.data ? 'POST' : 'GET',
      url: wepaCoreConfig.API_BASE_URL + endpoint,
      params: params,
      data: options.data,
      headers: {
        'Authorization': options.authHeader || this.defaultAuthHeader,
        'Content-Type': options.contentType || 'application/x-www-form-urlencoded'
      },
      // Angular serializes data into JSON by default. API expects ordinary URL encoding.
      transformRequest: function (data) {
        var serialized = ''
        angular.forEach(data, function (value, key) {
          serialized += window.encodeURIComponent(key) + '=' + window.encodeURIComponent(value) + '\n'
        })
        return serialized
      }
    }

    if (options.data instanceof window.FormData) {
      // See http://programmers.stackexchange.com/a/283119
      httpOptions.headers['Content-Type'] = undefined
      httpOptions.transformRequest = angular.identity
    }

    return $http(httpOptions)
      .then(function (response) {
        // $http returns meta information. We only need the actual JSON response.
        return response.data
      }, function (response) {
        // Same for errors.
        return $q.reject(response.data)
      })
  }
}

angular.module('wepaCore')
  .provider('wepaCoreConfig', wepaCoreConfigProvider)

/**
 * @class
 * @public
 */
function wepaCoreConfigProvider () {
  var config = {
    SUPPORTED_FILE_TYPES: [
      // Documents
      'doc', 'docx', 'xls', 'xlsx', 'pdf', 'rtf',
      // Presentations
      'ppt', 'pptx',
      // Images
      'png', 'jpg', 'jpeg', 'bmp', 'gif', 'tiff', 'tif'
    ],
    API_BASE_URL: 'https://development-api.wepanow.com',
    CLIENT_ID: 'wepa-printapp',
    CLIENT_SECRET: 'printq2W#'
  }

  /**
   * Sets specified custom settings.
   *
   * @param {Object} customSettings An object with custom setting values.
   * Existing settings will be overwritten if the same keys are specified.
   * New keys may be added.
   *
   * @example
   * angular.module('app').config(function (wepaCoreConfigProvider) {
   *   wepaCoreConfigProvider.set({
   *     API_BASE_URL: 'https://development-api.wepanow.com'
   *   })
   * })
   */
  this.set = function (customSettings) {
    angular.extend(config, customSettings)
  }

  this.$get = function () {
    return config
  }
}

angular.module('wepaCore')
  .constant('wepaCoreErrorMessages', {
    ERROR_EMPTY_CREDENTIALS: 'Email and password should not be empty!',
    INVALID_PARAMS: 'Invalid Parameters',
    INVALID_FILE_TYPE: 'File type does not match'
  }
)


remoteReleaseService.$inject = ['wepaCoreApi'];angular.module('wepaCore')
  .service('wepaCoreRemoteRelease', remoteReleaseService)

/**
 * @class
 */
function remoteReleaseService (wepaCoreApi) {
  /**
   * Gets a list of available remote release stations.
   *
   * @param {Array} keyList A list that contains ADA keys or beacon IDs
   *
   * @return {Promise} Resolves with a list of stations associated with the specified IDs
   */
  this.getStationList = function (keyList) {
    return wepaCoreApi.makeApiCall('/resources/kiosks/remote_release/list/keys/' + keyList.join(','))
  }

  /**
   * Submits a file prepared for print to be printed (remotely released) on a station.
   *
   * @param {Object} station The station object obtained from `getStationList`
   * @param {string} releaseCode Release code of the file to be printed
   *
   * @return {Promise} Resolves with status from the API
   */
  this.submit = function (station, releaseCode) {
    var endpointFullPath = '/resources/kiosks/' +
      'remote_release/submit/' + station.kiosk.name +
      '/release_code/' + releaseCode

    var postData = {key: station.stationKey}

    return wepaCoreApi.makeApiCall(endpointFullPath, null, {data: postData})
  }

  /**
   * Cancels a submitted remote release job.
   *
   * @param {string} transactionId ID of the transaction returned by the API when submitting a remote release job
   *
   * @return {Promise} Resolves with response from the API
   */
  this.cancel = function (transactionId) {
    var postData = {key: ''}
    return wepaCoreApi.makeApiCall('/resources/kiosks/remote_release/cancel/' + transactionId, null, {data: postData})
  }

  /**
   * Fetches status information of a submitted remote release job.
   *
   * @param {string} transactionId ID of the transaction returned by the API when submitting a remote release job
   *
   * @return {Promise} Resolves with status of the specified job
   */
  this.getStatus = function (transactionId) {
    return wepaCoreApi.makeApiCall('/resources/kiosks/remote_release/status/' + transactionId)
  }
}


schoolService.$inject = ['$q', 'wepaCoreApi', 'wepaCoreAuth'];angular.module('wepaCore')
  .service('wepaCoreSchool', schoolService)

/**
 * @class
 */
function schoolService ($q, wepaCoreApi, wepaCoreAuth) {
  /**
   * Fetches the list of all supported schools (groups).
   *
   * Automatically authenticates with client credentials if needed.
   *
   * @return {Promise} Resolves with the list of schools
   **/
  this.getList = function () {
    return wepaCoreAuth.authUsingClientCredentials()
      .then(function () {
        return wepaCoreApi.makeApiCall('/resources/groups')
      })
  }

  /**
   * Checks whether a school supports shibboleth or password-based auth.
   *
   * @param {Object} school A school object obtained from `getList`
   *
   * @return {boolean} `true` if the school supports shibboleth auth, `false` otherwise
   **/
  this.isShib = function (school) {
    return school.authentication.type === 'SESSION'
  }

  /**
   * Gets URL of the auth page of a school.
   *
   * @param {Object} school A school object obtained from `getList`
   *
   * @return {string} The auth URL
   */
  this.getShibUrl = function (school) {
    return school.authentication.shibbolethRedirectUrl
  }
}


uploadService.$inject = ['$q', 'wepaCoreConfig', 'wepaCoreErrorMessages', 'wepaCoreApi'];angular.module('wepaCore')
  .service('wepaCoreUpload', uploadService)

/**
 * @class
 */
function uploadService ($q, wepaCoreConfig, wepaCoreErrorMessages, wepaCoreApi) {
  /**
   * Checks that the type of a file is supported by wepa cloud.
   *
   * @param {string}  filename The name of a file
   *
   * @return {Boolean} `true` if the file is supported, `false` otherwise
   */
  this.isSupportedFile = function (filename) {
    if (!angular.isString(filename)) {
      return false
    }

    var fileType = filename.split('.').pop().toLowerCase()
    var hasType = filename.split('.').length > 1
    var isTypeSupported = wepaCoreConfig.SUPPORTED_FILE_TYPES.indexOf(fileType) !== -1

    return hasType && isTypeSupported
  }

  /**
   * Uploads a file to the print server.
   *
   * @param {File|Blob} file The file represented as a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects) or a `Blob` object.
   * @param {string} filename The name of the file
   * @param {Object} param See {@link https://api.wepanow.com/docs/files.htm} for a list of available print options.
   *
   * @return {Promise} Resolves with upload status.
   **/
  this.upload = function (file, filename, printOptions) {
    if (!this.isSupportedFile(filename)) {
      return $q.reject(wepaCoreErrorMessages.INVALID_FILE_TYPE)
    }

    var formData = new window.FormData()
    formData.append('file', file)

    return wepaCoreApi.makeApiCall('/resources/files/upload', printOptions, {
      data: formData
    })
  }
}


authService.$inject = ['$q', 'wepaCoreApi', 'wepaCoreConfig', 'wepaCoreErrorMessages'];angular.module('wepaCore')
  .service('wepaCoreAuth', authService)

/**
 * @class
 */
function authService ($q, wepaCoreApi, wepaCoreConfig, wepaCoreErrorMessages) {
  this.accessToken = ''

  /**
   * Authenticates a user by their email and password and obtains an access token.
   * The token is automatically stored and used in subsequent API calls. You
   * probably don't need to use it yourself.
   *
   * When authenticating using client credentials, this method will instantly resolve
   * with an existing token if possible to avoid downgrading from password-based auth.
   *
   * @param {string} email Email of a wepa user
   * @param {string} password Password of a wepa user in plain text
   * @param {boolean} [isClientCredentials=false] Set this to `true` to use `grant_type: "client_credentials"`
   *
   * @return {Promise} Resolves with an access token or rejects with an error from the API server.
   **/
  this.auth = function (email, password, isClientCredentials) {
    if (!email || !password) {
      return $q.reject({
        error: wepaCoreErrorMessages.INVALID_PARAMS,
        errorDescription: wepaCoreErrorMessages.ERROR_EMPTY_CREDENTIALS
      })
    }

    if (isClientCredentials && this.accessToken) {
      return $q.resolve(this.accessToken)
    }

    var self = this

    return wepaCoreApi.makeApiCall('/oauth/token', {
      grant_type: isClientCredentials ? 'client_credentials' : 'password',
      username: email,
      password: password
    }, {
      data: {},
      authHeader: 'Basic ' + this.getBasicAuthToken()
    })
      .then(function (data) {
        self.accessToken = data['access_token']
        wepaCoreApi.defaultAuthHeader = 'Bearer ' + self.accessToken
        return self.accessToken
      }, function (data) {
        return $q.reject(data)
      })
  }

  /**
   * Auths using credentials from the config.
   *
   * @return {Promise} Resolves with an access token or rejects with an error from the API server.
   */
  this.authUsingClientCredentials = function () {
    return this.auth(wepaCoreConfig.CLIENT_ID, wepaCoreConfig.CLIENT_SECRET, true)
  }

  /**
   * Calculates a basic auth token from credentials from the config.
   *
   * @return {string} A basic auth token that can be used during authentication
   */
  this.getBasicAuthToken = function () {
    return window.btoa(wepaCoreConfig.CLIENT_ID + ':' + wepaCoreConfig.CLIENT_SECRET)
  }
}


wepaCoreShibAuthDirective.$inject = ['$sce', 'wepaCoreSchool', 'wepaCoreAuth'];angular.module('wepaCore')
  .directive('wepaCoreShibAuth', wepaCoreShibAuthDirective)

/**
 * Represents an iframe with a shibboleth authentication page.
 *
 * Opens the page immediately when inserted into the DOM. You are responsible
 * for inserting this directive at the right time and hiding or removing it
 * after authentication.
 *
 * @param {Object} school An attribute set to the selected school
 * @param {Function} callback An attribute set to a function that will be
 * called upon successfull authentication
 *
 * @example @lang html
 * <wepa-core-shib-auth school="ctrl.selectedSchool" callback="ctrl.onSuccess"></wepa-core-shib-auth>
 */
function wepaCoreShibAuthDirective ($sce, wepaCoreSchool, wepaCoreAuth) {
  return {
    restrict: 'E',

    scope: {
      'school': '=',
      'callback': '='
    },

    template: '<iframe ng-src="{{getShibUrl()}}"></iframe>',
    replace: true,

    link: function (scope, element, attrs) {
      var frame = element[0]

      element.bind('load', function () {
        var credentials = scope.extractCredentials(frame)
        if (credentials) {
          wepaCoreAuth.auth(credentials.email, credentials.cookie)
            .then(scope.callback)
        }
      })
    },

    controller: ['$scope', function ($scope) {
      $scope.getShibUrl = function () {
        return $sce.trustAsResourceUrl(wepaCoreSchool.getShibUrl($scope.school))
      }

      $scope.extractCredentials = function (frame) {
        try {
          // frame.contentDocument will fail on a cross-origin frame.
          // This will only work on wepanow.com.
          var emailElement = frame.contentDocument.querySelector('#u-email')
          var cookieElement = frame.contentDocument.querySelector('#u-cookie')

          if (!emailElement || !cookieElement) {
            return null
          }

          return {
            email: emailElement.textContent,
            cookie: cookieElement.textContent
          }
        } catch (e) {
          return null
        }
      }
    }]
  }
}


})()
