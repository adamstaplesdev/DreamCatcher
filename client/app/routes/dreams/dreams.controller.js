'use strict';

angular.module('dreamCatcherApp')
  .controller('DreamsCtrl', function ($scope, navchain, $stateParams, dreamFactory) {

  	//initialize the progress color variable
  	$scope.progressColor = '#4cae4c';

  	//initialize the scope parameters to the navchain elements, in case the dream takes a moment to load
  	$scope.parent = {};
  	$scope.parent.progress = 0;
  	$scope.parent.maxProgress = 1;
  	if (navchain && navchain.top && navchain.top.data) {
	  	$scope.parent.name = navchain.top.data.name;
	  	$scope.parent.description = navchain.top.data.description;
		if (navchain.top.data.endDate) {
			$scope.parent.endDate = navchain.top.data.endDate;
		}  		
  	}

  	//first, get the goal that we need for this specific view
  	dreamFactory.getDream($stateParams.id, true).then(function(dream) {
  		//initialize the progress variables on anything that doesn't have them
  		//also, we'll have to initialize the progress on the dream
  		var totalDreamProgress = 0;
  		var maxDreamProgress = 0;
  		if (dream.subgoals) {
  			for (var i = 0; i < dream.subgoals.length; i++) {
  				if (!dream.subgoals[i].progress)
  					dream.subgoals[i].progress = 0;
  				else
  					totalDreamProgress += dream.subgoals[i].progress;

  				//calculate the percentage for each goal
  				dream.subgoals[i].percent = 100 * dream.subgoals[i].progress / dream.subgoals[i].amount;
  				maxDreamProgress += dream.subgoals[i].amount;
  			}
  		}
  		$scope.parent = dream;
  		$scope.parent.percent = totalDreamProgress / maxDreamProgress;
  	});

  	$scope.addProgress = function(goal) {
  		if (goal.progressType == 'habit') {
  			
  		}
  	}
  });
