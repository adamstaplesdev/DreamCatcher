'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope) {

  	$scope.view = 'landing';

  	//TODO - when we get auth put into the site, there should be some kind of check here to see if they're logged in.
  	//If they are logged in, then they should be auto-redirected to the home page.
  });
