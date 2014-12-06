'use strict';

angular.module('dreamCatcherApp')
  .directive('sidenav', function () {
    return {
      
	templateUrl: 'app/directives/sidenav/sidenav.html',

	restrict: 'E',
      
	  //scope: {
	  //
	  //}
	  
	controller: function($scope, dreamFactory, goalFactory){
		$scope.navChain = [];
		$scope.selectedItem = null;
		$scope.selectedItemType = null;
		
		//component initialization
		dreamFactory.getDreams().then(function(data){
			$scope.dreams = data;
			console.log('dreams received');
			console.log($scope.dreams);

			//play code
			dreamFactory.getDream($scope.dreams[0]._id, true).then(function(data){
				console.log(data);
				//Actual code to keep
				$scope.currentDream = data;
				$scope.selectedItem = $scope.currentDream;
				$scope.selectedItemType = 'dream';
				console.log($scope.selectedItem.name);
				$scope.subGoals = goalFactory.getGoals($scope.currentDream._id, 'dream');
			});

			
		});
		
		$scope.selectItem = function(id){
			//This will need to be reworked for selecting users
			console.log('selected id:' + id);
			goalFactory.getGoal(id).then(function(data){
				$scope.selectedItem = data;
				$scope.selectedItemType = 'goal';
			});
		}
		
		
		
		/*
		Object {name: "Lose 30 Lbs", type: "habit", subgoals: Array[3], description: "I would like to lose 30 lbs in 3 months", deadline: true}
		category: "Health" deadline: true description: "I would like to lose 30 lbs in 3 months" name: "Lose 30 Lbs" subgoals: Array[3]
			0: Object $$hashKey: "object:362" expand: true name: "Lose 2 Lbs" type: "habit"__proto__: Object
			1: Object $$hashKey: "object:364" expand: true name: "Exercise more" type: "deadline"__proto__: Object
			2: Object $$hashKey: "object:366" expand: true name: "Stop watching netflix" type:"quantitative"__proto__: Object
		length: 3__proto__: Array[0]type: "habit"__proto__: Object
		*/
	}
	//link: function (scope, element, attrs) {
	//}
    };
  });