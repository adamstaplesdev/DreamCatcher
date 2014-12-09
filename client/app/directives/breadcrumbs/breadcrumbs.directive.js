'use strict';

angular.module('dreamCatcherApp')
  .directive('breadcrumbs', function () {
	return {
		templateUrl: 'app/directives/breadcrumbs/breadcrumbs.html',
		
		restrict: 'E',
		
		scope: {},
		
		controller: function($scope, navchain){
			$scope.chain = navchain.chain;
			
			//When this function is called, pass $index
			//to get the ng-repeat index.
			$scope.selectItem = function(index){
				//As long as chain is not null, this should work.
				var numSteps = $scope.chain.top.urlChain.length - (index + 1);
				navchain.jump(numSteps);
			}
		}
		//link: function (scope, element, attrs) {
		//}
	};
});