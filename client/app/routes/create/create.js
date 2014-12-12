'use strict';

angular.module('dreamCatcherApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('create', {
        url: '/create',
        templateUrl: 'app/routes/create/create.html',
        controller: 'CreateCtrl',
        authenticate: true
      });
  });