/**
 * Copyright (c) 2016, wepa Inc
 * All rights reserved.
 * @name wepaUI.controller:DashboardCtrl
 * @desc: This file is a Dashboard Controller of wepaUI module and it is responsible for handling all the events and
 * actions from dashboard page.
 * @dependencies: $scope, wepaLogin, $mdDialog, webCommConst, webMessageConst, webErrorConst, session
 * @author Vijay Ragavan
 */

'use strict'

angular.module('wepaUI')
  .controller('ReleaseCtrl', function ($scope, $http, wepaCore, wepaUIMessageConst, wepaUIErrorMessage,
    $mdDialog, session, $location, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder) {
    $scope.fullName = ''
    $scope.userBalance = ''
    $scope.persons = ''
    $scope.succResponse = ''
    $scope.errorResponse = ''
    $scope.releasefiles = null

    /* DataTable Responsive view changes based on the screen width */

    if (window.innerWidth < 751) {
      $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3).withClass('none'),
        DTColumnDefBuilder.newColumnDef(4).withClass('none')
      ]
    }
    if (window.innerWidth < 630) {
      $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2).withClass('none'),
        DTColumnDefBuilder.newColumnDef(3).withClass('none'),
        DTColumnDefBuilder.newColumnDef(4).withClass('none')
      ]
    }
    if (window.innerWidth > 751) {
      $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3),
        DTColumnDefBuilder.newColumnDef(4)
      ]
    }
    $scope.dtOptionsdata = DTOptionsBuilder.newOptions()
      .withOption('responsive', true)
      .withOption('paging', false)
      .withOption('scrollCollapse', true)

    $scope.dtColumns = [
      DTColumnBuilder.newColumn('TransactionID').withTitle('TransactionID'),
      DTColumnBuilder.newColumn('ReleaseCode').withTitle('ReleaseCode'),
      DTColumnBuilder.newColumn('Status').withTitle('Status').notVisible()
    ]
    /**
     * @desc: This method get the all uploaded file list from the library call
     * it is responsible for (1) Call wepa core library for getFileList function (2) Get and parse the response data
     * from library call (3) Display the uploaded file list (4) Call remote release functions - submitRemoterelease(),
     * cancelRemoterelease() and getRemotereleasestatus()
     *
     * @action getFileDetails initially called from the controller and show the all uploaded file list.
     **/

    $scope.getFileDetails = function () {
      if (!session.isAuthenticated()) {
        $location.path('/login')
      } else {
        $scope.footer = true
      }

      console.log('getFileDetails starts')

      $scope.token = session.getAuthTokenFromCookie()
      $scope.filenamesession = session.getFilename()
        console.log($scope.filenamesession)
        $scope.file = []
        var j = 0
        $scope.kioskStationKey = ''
        $http.get('config/config.json')
            .then(function(response) {
                $scope.kioskStationKey = response.data.kioskStationIDKey

                wepaCore.getRemoteReleaseStationList([$scope.kioskStationKey])
                    .then(function (response) {

                        for (var i = 0; i < $scope.filenamesession.length; i++) {
                            if($scope.filenamesession[i].checked == true) {
                                $scope.file[j] = $scope.filenamesession[i]
                                {
                                    (function(j){
                                    wepaCore.submitRemoteRelease(response[0], $scope.filenamesession[i].releaseCode)
                                        .then(function (response) {
                                            console.log(response)
                                            $scope.file[j].transactionId = response.transactionId
                                            $scope.file[j].remotePrintStatus = 'PROCESSING'
                                            console.log($scope.file[j])
                                        })
                                    })(j);
                                }
                                j++;
                            }
                        }
                        setInterval(function () {
                            $scope.refreshPrintStatus()
                        }, 10000)
                    })
                    .catch(function(error){
                        console.log(error)
                    })
            })

    }

      $scope.refreshPrintStatus = function () {
          for(var i=0; i < $scope.file.length; i++)
          {
              {
                  (function(i){
                    wepaCore.getRemoteReleaseStatus($scope.file[i].transactionId)
                    .then(function (response) {
                      $scope.file[i].remotePrintStatus = response.status
                    })
                  })(i);
              }
          }
      }

    $scope.cancelprint = function (transactionId) {
        var confirm = $mdDialog.confirm()
            .title('Important')
            .textContent('Are you sure do you want to cancel this remote release?')
            .ok('Yes')
            .cancel('No')
        $mdDialog.show(confirm).then(function () {
            console.log("Cancel starts")
            console.log(transactionId)
            wepaCore.cancelRemoteRelease(transactionId)
                .then(function (response) {
                    if (response.success) {
                        $scope.cancel = true
                        $scope.showbar = true
                    } else {
                        $scope.cancel = false
                        $scope.showbar = false
                    }
                })
        }, function () {
            $scope.status = ''
        })
    }
    $scope.getFileDetails()

    /**
     * @desc: This method get the user details from the library call
     * it is responsible for (1) Call wepa core library for getUserInfo function (2) Get and parse the response data
     * from library call (3) Display the uploaded file list
     *
     * @action getUserInfo initially called from the controller and show the user information.
     **/
    $scope.getUserName = function () {
      wepaCore.getUserInfo($scope.token)
        .then(function (response) {
          $scope.succResponse = response
          $scope.fullName = $scope.succResponse.firstName + ' ' + $scope.succResponse.lastName
          $scope.userBalance = $scope.succResponse.wepaCurrentBalance
        })
    }
    $scope.getUserName()
    /**
     * @desc: This method clear the current user session data
     * it is responsible for (1) remove user session (2) redirect to login page
     **/
    $scope.logOut = function () {
      session.destroy()
      $location.path('/login')
    }
    $scope.goDashboard = function () {
      $location.path('/dashboard')
    }
    /*
     * @desc: This method is used to show processing dialog box. If user submit the form with valid details
     * this box will appear and intimate to user request has been processing
     */
    $scope.showAlert = function (ev) {
      $scope.hide = false
      $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Sure!! Abort the printing')
          .textContent('Click OK to Abort')
          .ok(wepaUIMessageConst.DIALOG_OK)
          .targetEvent(ev)
      )
    }
  })
