'use strict'

angular.module('wepaUI')
  .controller('UploadCtrl', function ($scope, $timeout, wepaCore, $location, session, popupMessage) {
    $scope.orientation = ''
    $scope.print = true
    $scope.side = ''
    $scope.copies = ''
    $scope.printRangeStart = ''
    $scope.printRangeEnd = ''
    $scope.endrange = ''
    $scope.param = {}
    $scope.fileId = ''
    $scope.callCount = 0
    $scope.selectPotrait = true
    $scope.fileId = ''
    $scope.checkboxModelvalue = ''
    $scope.succResponse = ''
    $scope.errorResponse = ''

    //  set page Orientation value
    $scope.potrait = function () {
      $scope.orientation = 'potrait'
      $scope.selectPotrait = true
    }
    $scope.landscape = function () {
      $scope.orientation = 'landscape'
      $scope.selectPotrait = false
    }

    //  Set color of the Print
    $scope.printcolor = function () {
      $scope.print = true
    }
    $scope.printbw = function () {
      $scope.print = false
    }

    //  Single or Double side of Print
    $scope.singleside = function () {
      $scope.side = 'singleside'
    }
    $scope.doubleside = function () {
      $scope.side = 'doubleside'
    }

    //  To get Access token for the logged User
    $scope.getUserDetails = function () {
      $scope.token = session.getAuthTokenFromCookie()
      wepaCore.getUserInfo($scope.token)
        .then(function (response) {
          $scope.succResponse = response
          $scope.fullName = response.firstName + ' ' + response.lastName
          $scope.userBalance = response.wepaCurrentBalance
        })
        .catch(function (err) {
          $scope.errorResponse = err
        })
    }

    $scope.getUserDetails()

    $scope.upload = function (files) {
      popupMessage.show('Attention, ' + $scope.fullName, 'Your upload is being processed!')
      $scope.fileName = files[0].name
      $scope.fileType = files[0].type
      $scope.fileSize = files[0].size

      if ($scope.copies !== '') {
        $scope.param.copies = $scope.copies
      }
      if ($scope.orientation !== '') {
        $scope.param.orientation = $scope.orientation
      }
      if ($scope.print !== '') {
        $scope.param.color = $scope.print
      }
      if ($scope.printRangeStart !== '') {
        $scope.param.printRangeStart = $scope.printRangeStart
      }
      if ($scope.printRangeEnd !== '') {
        $scope.param.printRangeEnd = $scope.printRangeEnd
      }
      if ($scope.checkboxModelvalue !== '') {
        $scope.param.printRange = $scope.checkboxModelvalue
      }
      wepaCore.uploadFile(files[0], $scope.fileName, $scope.param)
        .then(function (response) {
          $scope.succResponse = response
          $scope.fileRefId = response.fileRefId
          $timeout($scope.calReleaseCode, 3000)
        })
        .catch(function (err) {
          $scope.errorResponse = err
        })
    }

    $scope.calReleaseCode = function () {
      $scope.callCount = $scope.callCount + 1
      wepaCore.getFileStatus($scope.fileRefId)
        .then(function (response) {
          if (response.status === 'READY_FOR_PRINT') {
            popupMessage.show('Attention, ' + $scope.fullName, 'Wepa Code: ' + response.releaseCode,
              'Go to dashboard', 'Another upload')
              .then(function () {
                $location.path('/Dashboard')
              })
          } else {
            $timeout($scope.calReleaseCode, 3000)
          }
        })
        .catch(function () {
          $timeout($scope.calReleaseCode, 3000)
        })
    }
  })
