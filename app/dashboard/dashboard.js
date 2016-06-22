'use strict'

angular.module('wepaUI')
  .controller('DashboardCtrl', function ($scope, $http, wepaCore, wepaUIMessageConst, wepaUIErrorMessage, $mdDialog,
    session, $location, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder) {
    $scope.fullName = ''
    $scope.userBalance = ''
    $scope.persons = ''
    $scope.succResponse = ''
    $scope.errorResponse = ''
    $scope.list = {files: []}
    $scope.length = ''

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
      DTColumnBuilder.newColumn('Wepacode').withTitle('Wepacode'),
      DTColumnBuilder.newColumn('Name').withTitle('Name'),
      DTColumnBuilder.newColumn('Sent').withTitle('Sent').notVisible()
    ]

    /**
     * @desc: This method get the all uploaded file list from the library call
     * it is responsible for (1) Call wepa core library for getFileList function (2) Get and parse the response data
     * from library call (3) Display the uploaded file list
     *
     * @action getFileDetails initially called from the controller and show the all uploaded file list.
     **/
    $scope.getFileDetails = function () {
      if (!session.isAuthenticated()) {
        return $location.path('/login')
      }
      $scope.token = session.getAuthTokenFromCookie()
      wepaCore.getFileList()
        .then(function (response) {
          $scope.printlist = response
            for(var i=0; i < $scope.printlist.length; i++)
            {
                $scope.printlist[i].checked = false
            }
          session.putFilename($scope.printlist)
          $scope.getUserName()
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

    /**
     * @desc: This method provide a page that user can upload their files
     *
     **/
    $scope.upload = function () {
      $location.path('/upload')
    }

    /**
     * @desc: This method clear the current user session data
     * it is responsible for (1) remove user session (2) redirect to login page
     **/
    $scope.logOut = function () {
      session.destroy()
      $location.path('/login')
    }
    /*
     * @desc: This method is used to show processing dialog box. If user submit the form with valid details
     * this box will appear and intimate to user request has been processing
     */
    $scope.showAlert = function (ev) {
      $scope.hide = false
      $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(false)
          .title('Printing the Files')
          .textContent('Files ReleaseCode is:' + $scope.data)
          .ok(wepaUIMessageConst.DIALOG_OK)
          .targetEvent(ev)
      )
    }
    /**
     * @desc This method is used to inform the user that he/she didn't use the files to print
     * @param ev
     */
    $scope.showConfirm = function (ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .title('Important')
        .textContent('No prints selected! Please select print list for remote release.')
        .targetEvent(ev)
        .ok('OK')
      $mdDialog.show(confirm).then(function () {
        $scope.status = 'You decided to get rid of your debt.'
      }, function () {
        $scope.status = 'You decided to keep your debt.'
      })
    }
    /**
     * @desc thi method is used to print the selected print files by the User,Then shows the Status of the Printing
     * file
     * @constructor
     */
    $scope.Releasecodelist = function () {
        console.log($scope.printlist)
        $scope.length = 0
        for(var i=0; i < $scope.printlist.length; i++)
        {
            if($scope.printlist[i].checked == true)
            {
                $scope.length++;
            }
        }
      if ($scope.length === 0) {
        $scope.showConfirm()
      } else {
        $location.path('/release')
      }
    }
  })
