'use strict';

angular.module('dreamCatcherApp')
  .controller('DreamsCtrl', function ($scope, navchain) {
	console.log(navchain);
    $scope.chain = navchain.chain;
  });
