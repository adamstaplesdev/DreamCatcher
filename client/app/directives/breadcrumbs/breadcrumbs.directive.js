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
				$scope.chain.jump(index);
			}
		}
		//link: function (scope, element, attrs) {
		//}
	};
});