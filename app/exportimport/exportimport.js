angular.module('myApp.exportimport', [])

.controller('ExportImportController', ['$scope', '$route', 'ngToast', function($scope, $route, ngToast) {
  var content = JSON.stringify(localStorage);
  var blob = new Blob([ content ], { type : 'text/plain' });
  $scope.url = (window.URL || window.webkitURL).createObjectURL( blob );

  $scope.clickUpload = function() {
    angular.element('#upload').trigger('click');
  };

  $scope.fileNameChanged = function(element) {
    var reader = new FileReader();
    reader.onload = function() {
      try {
        var importedData = reader.result;
        var localStorageJSON = JSON.parse(importedData);
        for (key in  localStorageJSON) {
          localStorage[key] = localStorageJSON[key];
        }
        $route.reload();
        ngToast.create("Successfully imported data!");
      } catch (e) {
        ngToast.danger({
          content: "Failed to import data!"
        });
      }
    };
    reader.readAsText(element.files[0]);
    angular.element('#upload').val('');
  };
}]);
