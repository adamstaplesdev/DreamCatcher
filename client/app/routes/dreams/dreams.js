'use strict';

angular.module('dreamCatcherApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('dreams', {
        url: '/dreams/:id',
        templateUrl: 'app/routes/dreams/dreams.html',
        controller: 'DreamsCtrl',
        authenticate: true
      });
  });