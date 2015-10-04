'use strict';

angular.module('myApp.exercises', ['ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/exercises', {
    templateUrl: 'exercises/exercises.html',
    controller: 'ExercisesCtrl'
  });
}])

.controller('ExercisesCtrl', ['$scope', 'ngToast', function($scope, ngToast) {
  $scope.debug = false;

  $scope.localStorage = localStorage;

  $scope.updateField = function(field, value) {
    $scope.localStorage.setItem(field, JSON.stringify(value));
  };

  $scope.updateData = function() {
    // Legacy, keeping for when we move to databases
  };

  $scope.getField = function(field) {
    return JSON.parse($scope.localStorage.getItem(field));
  };

  $scope.newExercise = {name: "", done: false, cssClass: "accordionUndone"};
  $scope.exercises = $scope.getField('exercises') ? $scope.getField('exercises') : [];

  $scope.updateExercise = function() {
    $scope.updateField("exercises", $scope.exercises);
    $scope.updateData();
  };

  $scope.addToList = function() {
    var newElement = {title: $scope.newExercise.title, sets:$scope.newExercise.sets, reps:$scope.newExercise.reps};
    if (newElement.title != "") {
        $scope.exercises.push(newElement);
        $scope.updateExercise();
    }
    $scope.newExercise.title = "";
    $scope.newExercise.sets = "";
    $scope.newExercise.reps = "";
    ngToast.create("Added new exercise '" + newElement.title + "'!")
  };

  $scope.removeFromList = function(item) {
    var index = $scope.exercises.indexOf(item);
    if (index > -1)
    {
      $scope.exercises.splice(index, 1);
    }
    $scope.updateExercise();
    ngToast.danger({content : "Deleted '" + item.title + "'"});
  };

  $scope.duplicate = function(item) {
    // Super lame copy logic
    $scope.exercises.push(JSON.parse(JSON.stringify(item)));
    $scope.updateExercise();
    ngToast.create("Duplicated '" + item.title + "'");
  };

}]);
