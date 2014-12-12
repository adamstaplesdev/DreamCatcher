'use strict';

angular.module('dreamCatcherApp')
  .controller('GoalsCtrl', function ($scope, $stateParams, navchain, goalFactory) {
	//initialize the progress color variable
  	$scope.progressColor = '#4cae4c';

  	//initialize the scope parameters to the navchain elements, in case the dream takes a moment to load
  	$scope.parent = {};
  	$scope.parent.progress = 0;
  	$scope.parent.maxProgress = 1;
	$scope.canAddProgress = true;
  	if (navchain && navchain.top && navchain.top.data) {
	  	$scope.parent.name = navchain.top.data.name;
	  	$scope.parent.description = navchain.top.data.description;
		if (navchain.top.data.endDate) {
			$scope.parent.endDate = navchain.top.data.endDate;
		}  		
  	}

  	//first, get the goal that we need for this specific view
  	goalFactory.getGoal($stateParams.id).then(function(goal) {
  		//initialize the progress variables on anything that doesn't have them
  		//also, we'll have to initialize the progress on the dream
  		var totalGoalProgress = 0;
  		var maxGoalProgress = 0;
  		if (goal.subgoals) {
  			for (var i = 0; i < goal.subgoals.length; i++) {
  				if (!goal.subgoals[i].progress)
  					goal.subgoals[i].progress = 0;
  				else
  					totalGoalProgress += goal.subgoals[i].progress;

  				//calculate the percentage for each goal
  				goal.subgoals[i].percent = 100 * goal.subgoals[i].progress / goal.subgoals[i].amount;
  				maxGoalProgress += goal.subgoals[i].amount;
  			}
  		}
  		$scope.parent = goal;
  		$scope.parent.percent = totalGoalProgress / maxGoalProgress;
  	});

  	$scope.addProgress = function(goal) {
  		if (goal.progressType == 'habit') {
  			
  		}
		if (goal.progressType == 'deadline') {
		
		}
		if (goal.progressType == 'quantity') {
		
		}
  	}
  });
