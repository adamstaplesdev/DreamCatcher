'use strict';

angular.module('dreamCatcherApp')
  .controller('GoalsCtrl', function ($scope, navchain) {
	console.log(navchain);
    $scope.chain = navchain.chain;
  });
