'use strict';

angular.module('dreamCatcherApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('goals', {
        url: '/goals/:id',
        templateUrl: 'app/routes/goals/goals.html',
        //templateUrl: 'app/routes/dreams/dreams.html',
        controller: 'GoalsCtrl',
        authenticate: true
      });
  });