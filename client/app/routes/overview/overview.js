'use strict';

angular.module('dreamCatcherApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('overview', {
        url: '/overview',
        templateUrl: 'app/routes/overview/overview.html',
        controller: 'OverviewCtrl'
      });
  });