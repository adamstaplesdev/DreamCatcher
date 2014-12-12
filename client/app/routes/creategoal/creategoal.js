'use strict';

angular.module('dreamCatcherApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('creategoal', {
        url: '/creategoal',
        templateUrl: 'app/routes/creategoal/creategoal.html',
        controller: 'CreategoalCtrl',
        authenticate: true
      });
  });