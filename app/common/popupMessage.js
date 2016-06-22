angular.module('wepaUI')
  .service('popupMessage', popupMessageService)

function popupMessageService ($mdDialog, wepaUIMessageConst) {
  /**
   * Shows a popup using [$mdDialog](https://material.angularjs.org/latest/api/service/$mdDialog).
   * If `cancelLabel` is passed, a confirm popup will be shown. Otherwise, an alert with a single button.
   *
   * @param {string} title Title of the popup
   * @param {string} content Text content of the popup
   * @param {string} [okLabel=wepaUIMessageConst.DIALOG_OK] OK button label
   * @param {string} [cancelLabel] Cancel button label
   *
   * @return {Promise} Result of `$mdDialog.show()`
   */
  this.show = function (title, content, okLabel, cancelLabel) {
    var popup = cancelLabel ? $mdDialog.confirm() : $mdDialog.alert()

    popup
      .title(title)
      .textContent(content)
      .ok(okLabel || wepaUIMessageConst.DIALOG_OK)

    if (cancelLabel) {
      popup.cancel(cancelLabel)
    }

    return $mdDialog.show(popup)
  }
}
