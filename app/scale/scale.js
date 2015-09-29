'use strict';

var major_progression = [0, 2, 4, 5, 7, 9, 11, 12, 11, 9, 7, 5, 4, 2, 0];
var minor_progression = [0, 2, 3, 5, 7, 8, 11, 12, 11, 8, 7, 5, 3, 2, 0];
var melodic_minor_progression = [0, 2, 3, 5, 7, 9, 11, 12, 10, 8, 7, 5, 3, 2, 0];

var major_fifths = ['C', 'G', 'D', 'A', 'E', 'B', 'G♭', 'D♭', 'A♭', 'E♭', 'B♭', 'F'];
var minor_fifths = ['A', 'E', 'B', 'F♯', 'C♯', 'G♯', 'D♯', 'B♭', 'F', 'C', 'G', 'D'];

var major_chromatic = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
var minor_chromatic = ['A', 'B♭', 'B', 'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯'];

angular.module('myApp.scale', ['ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/scale', {
    templateUrl: 'scale/scale.html',
    controller: 'ScaleCtrl'
  });
}])

.controller('ScaleCtrl', ['$scope', 'ngToast', function($scope, ngToast) {
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

  $scope.major = "";
  $scope.tempos = {normal: 80};
  $scope.tempoIncrease = $scope.getField('tempoIncrease') ? $scope.getField('tempoIncrease') : 4;
  $scope.selected = $scope.getField('selected') ? $scope.getField('selected') : [];
  $scope.keysPerDay = $scope.getField('keysPerDay') ? $scope.getField('keysPerDay') : 3;
  $scope.doneToday = $scope.getField('doneToday') ? $scope.getField('doneToday') : 0;

  $scope.forToday = [];
  $scope.forTheFuture = [];

  $scope.showLeft = function(item) {
    return $scope.selected.indexOf(item) != 0;
  };

  $scope.showRight = function(item) {
    return $scope.selected.indexOf(item) != $scope.selected.length - 1;
  };

  $scope.moveLeft = function(item) {
    var index = $scope.selected.indexOf(item);
    var newIndex = index - 1;
    if (newIndex > -1) {
      var movedItem = $scope.selected[newIndex];
      $scope.selected[newIndex] = item;
      $scope.selected[index] = movedItem;
    }
    $scope.updateField("selected", $scope.selected);
    $scope.collectLists();
  };

  $scope.moveRight = function(item) {
    var index = $scope.selected.indexOf(item);
    var newIndex = index + 1;
    if (newIndex < $scope.selected.length) {
      var movedItem = $scope.selected[newIndex];
      $scope.selected[newIndex] = item;
      $scope.selected[index] = movedItem;
    }
    $scope.updateField("selected", $scope.selected);
    $scope.collectLists();
  };

  $scope.lastUsedDate = $scope.getField("lastUsedDate");
  if (!$scope.lastUsedDate) {
    $scope.lastUsedDate = new Date()
    $scope.lastUsedDate.setDate($scope.lastUsedDate.getDate() - 1);
  } else {
    $scope.lastUsedDate = new Date($scope.lastUsedDate);
  }
  $scope.lastUsedDate.setHours(0,0,0,0); // In case the time is non-pure date

  $scope.majors = major_chromatic;
  $scope.minors = minor_chromatic;

  $scope.collectLists = function() {
    $scope.forToday = [];
    var numForToday = $scope.keysPerDay - $scope.doneToday;
    var selected = $scope.selected.slice();
    if (numForToday > 0) {
      while (numForToday-- && selected.length > 0) {
        $scope.forToday.push(selected.shift());
      }
    }
    $scope.forTheFuture = selected;
  };

  $scope.newDay = function() {
    $scope.doneToday = 0;
    $scope.updateField("doneToday", 0);
    $scope.updateData();
  };

  $scope.today = new Date();
  $scope.today.setHours(0,0,0,0);
  if ($scope.lastUsedDate.valueOf() !== $scope.today.valueOf()) {
    $scope.newDay();
  }

  $scope.collectLists();

  $scope.changeKeysPerDay = function() {
    $scope.updateField("keysPerDay", $scope.keysPerDay);
    $scope.updateData();
    $scope.collectLists();
  };

  $scope.changeTempoIncrease = function() {
    $scope.updateField("tempoIncrease", $scope.tempoIncrease);
    $scope.updateData();
  };

  $scope.resetDoneToday = function() {
    $scope.doneToday = 0;
    $scope.updateField("doneToday", 0);
    $scope.updateData();
    $scope.collectLists();
  };

  $scope.addToList = function(key, majorminor) {
    if (isNaN(parseFloat($scope.tempos.normal)) || !isFinite($scope.tempos.normal))
    {
      ngToast.danger({content: "Please check that the starting tempo value is a number"});
      return;
    }
    var newElement = {key: key + " " + majorminor, tempo: parseInt($scope.tempos.normal, 10)};
    $scope.selected.push(newElement);
    $scope.collectLists();
    $scope.updateField("selected", $scope.selected);
    $scope.updateData();
    ngToast.create("Added " + key + " " + majorminor + "!")
  };

  $scope.addAllToList = function(keys, majorminor) {
    keys.forEach(function(element, index, array) {
      $scope.addToList(element, majorminor);
    });
  };

  $scope.removeFromList = function(item) {
    var index = $scope.selected.indexOf(item);
    if (index > -1)
    {
      $scope.selected.splice(index, 1);
    }
    $scope.collectLists();
    $scope.updateField("selected", $scope.selected);
    $scope.updateData();
    ngToast.danger({content: "Removed " + item.key});
  };

  $scope.increaseTempo = function(item) {
    if (isNaN(parseFloat($scope.tempoIncrease)) || !isFinite($scope.tempoIncrease))
    {
      ngToast.danger({content: "Please check that the tempo increase value is a number"});
      return;
    }
    var index = $scope.selected.indexOf(item);
    if (index > -1)
    {
      $scope.selected.splice(index, 1);
      item.tempo += $scope.tempoIncrease;
      $scope.selected.push(item);
      $scope.doneToday += 1;
    }
    $scope.collectLists();

    $scope.updateField("selected", $scope.selected);
    var date = new Date();
    $scope.updateField("lastUsedDate", date.toISOString());
    $scope.updateField("doneToday", $scope.doneToday);
    $scope.updateData();
    ngToast.create("Nice! Next time, " + item.tempo + "bpm!");
  };

}]);
