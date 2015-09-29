'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'ngAnimate',
  'ngToast',
  'myApp.home',
  'myApp.exercises',
  'myApp.workouts',
  'myApp.exportimport'
]).
config(['$routeProvider', '$compileProvider', 'ngToastProvider', function($routeProvider, $compileProvider, ngToastProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
  ngToastProvider.configure({
    animation: 'fade'
  });
}]).
directive('numbersOnly', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (inputValue) {
        var transformedInput = inputValue ? inputValue.replace(/[^\d]/g,'') : null;
        if (transformedInput != inputValue) {
          modelCtrl.$setViewValue(transformedInput);
          modelCtrl.$render();
        }
        return parseInt(transformedInput,10);
      });
    }
  }
});
