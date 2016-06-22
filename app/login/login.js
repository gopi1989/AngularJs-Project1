'use strict'

angular.module('wepaUI')
  .controller('LoginCtrl', LoginCtrl)

function LoginCtrl ($scope, $http, wepaCore, popupMessage, wepaUIErrorMessage, $location, session) {
  $scope.schoolId = null
  $scope.schoolUsernameLbl = 'Username'
  $scope.schoolPasscodeLbl = 'Password'
  $scope.isLoading = true

  if (session.isAuthenticated()) {
    $location.path('/dashboard')
  }

  $scope.schoolList = []
  $scope.selectedShibSchool = null

  wepaCore.getSchoolList().then(function (schoolList) {
        $scope.schoolList = schoolList
        $scope.onLoginLoaded(schoolList)
      })

  $scope.onSchoolSelected = function (school) {
    if (wepaCore.isShibSchool(school)) {
      $scope.selectedShibSchool = school
      $scope.isLoading = true
    } else {
      $scope.isLoading = false
      $('[name=txt_email]').focus()
    }
  }

  $scope.onShibAuth = function () {
    $scope.selectedShibSchool = null
    session.create('', '')
  }

  $scope.onLoginLoaded = function (school) {
    $scope.isLoading = true
    $http.get('config/config.json')
        .then(function(response)
        {
          $scope.schoolId = response.data.scId
          $scope.schoolUsernameLbl = response.data.scUsernameText
          $scope.schoolPasscodeLbl = response.data.scPasswordText

          angular.forEach(school, function(value, key) {
            if($scope.schoolId == value.id)
            {
              $scope.onSchoolSelected(value)
            }
          })
        })
        .catch(function(error)
        {
          console.log(error)
        })
  }

  /**
   * @desc: This method handles the login request from UI and
   * it is responsible for (1) Call wepa core library for login function (2) Get and parse the response data
   * from library call (3) manage the application workflow based on the response ( success - redirect to dashboard,
   * failed - return error message )
   *
   * @action login page action would be varied based on user verification status.
   * If user is valid, page will redirect to dashboard page
   * else it will show the error message.
   **/
  $scope.loginAction = function () {
    $scope.isLoading = true

    wepaCore.login($scope.txt_email, $scope.pwd_password)
      .then(function (response) {
        session.create('', '')
        $location.path('/dashboard')
      })
      .catch(function (err) {
        popupMessage.show(wepaUIErrorMessage.INVALID_AUTHENTICATION, err.data)
        $scope.isLoading = false
      })
  }
}
