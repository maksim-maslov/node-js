'use strict';

angular.module('myApp', ['ngRoute'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
    when('/', {
      templateUrl: '/app/src/Client/Client.html',
      controller: 'ClientCtrl'
    }).
    when('/kitchen', {
      templateUrl: '/app/src/Cook/Cook.html',
      controller: 'CookCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });

  }
])

