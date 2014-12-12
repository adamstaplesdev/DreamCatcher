'use strict';

angular.module('dreamCatcherApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('goals', {
        url: '/goals/:id',
        // I changed the template url so that it gets shared with the dreams template
        // templateUrl: 'app/routes/goals/goals.html',
        templateUrl: 'app/routes/dreams/dreams.html',
        controller: 'GoalsCtrl',
        authenticate: true
      });
  });