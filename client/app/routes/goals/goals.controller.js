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
  		$scope.parent.progress = totalGoalProgress;
  		$scope.parent.maxProgress = maxGoalProgress;
		$scope.parent.percent = 100 * totalGoalProgress / maxGoalProgress;
  		$scope.parent.percent = $scope.parent.percent.toFixed(0);
  	});
	
	$scope.updateProgress = function(goal) {
  		//this is a little tricky, because if its parent types are goals, it will need to update its parent progress as well.
  		//that being said, in this particular function, this is the dreams controller, so all of these will be direct children
  		//of subgoals. So all we have to do is actually update the goal.
  		goalFactory.putGoal(goal).then(function(updatedgoal) {
  			console.log("Goal updated: ", updatedgoal);
  		}, function() {
  			console.log("error");
  		});
  	}

  	$scope.addProgress = function(goal) {
  		if (goal.type == 'habit') {
  			$scope.habitModal().result.then(function(progress) {
  				goal.progress += progress;
  				goal.percent = 100 * goal.progress / goal.amount;
  				$scope.parent.progress += progress;
		  		$scope.parent.percent = (100 * $scope.parent.progress) / $scope.parent.maxProgress;
		  		$scope.parent.percent = $scope.parent.percent.toFixed(0);
		  		$scope.updateProgress(goal);
  			});
  		}
  		else if (goal.type == 'deadline') {
  			$scope.deadlineModal().result.then(function(progress) {
  				goal.progress = 1;
  				goal.percent = 100;
  				$scope.parent.progress += 1;
		  		$scope.parent.percent = (100 * $scope.parent.progress) / $scope.parent.maxProgress;
		  		$scope.parent.percent = $scope.parent.percent.toFixed(0);
		  		$scope.updateProgress(goal);
  			});
  		}
  		else if (goal.type == 'quantitative') {
  			$scope.quantitativeModal().result.then(function(progress) {
  				var difference = progress;
  				goal.progress += progress;
  				if (goal.progress > goal.amount) {
  					difference = goal.amount - difference;
  					goal.progress = goal.amount;
  				}
  				goal.percent = 100 * goal.progress / goal.amount;
  				$scope.parent.progress += difference;
		  		$scope.parent.percent = (100 * $scope.parent.progress) / $scope.parent.maxProgress;
		  		$scope.parent.percent = $scope.parent.percent.toFixed(0);
		  		$scope.updateProgress(goal);
  			});
  		}
  	}


  	$scope.quantitativeModal = function() {
		var modalController = function($scope, $modalInstance) {
			$scope.progress = 1;

			$scope.close = function() {
				$modalInstance.close($scope.progress);
			};

			$scope.cancel = function() {
				$modalInstance.dismiss();
			};
		};

		//use $inject to make it minification safe
		modalController.$inject = ['$scope', '$modalInstance'];

		var modalInstance = $modal.open({
			templateUrl: 'app/routes/dreams/quantitativeModal.html',
			controller: modalController,
		});

		return modalInstance;
  	};

  	$scope.habitModal = function() {
		var modalController = function($scope, $modalInstance) {
			$scope.progress = 1;

			$scope.close = function() {
				$modalInstance.close($scope.progress);
			};

			$scope.cancel = function() {
				$modalInstance.dismiss();
			};
		};

		//use $inject to make it minification safe
		modalController.$inject = ['$scope', '$modalInstance'];

		var modalInstance = $modal.open({
			templateUrl: 'app/routes/dreams/habitModal.html',
			controller: modalController,
		});

		return modalInstance;
  	};

  	$scope.deadlineModal = function() {
		var modalController = function($scope, $modalInstance) {
			$scope.close = function() {
				$modalInstance.close(true);
			};

			$scope.cancel = function() {
				$modalInstance.dismiss();
			};
		};

		//use $inject to make it minification safe
		modalController.$inject = ['$scope', '$modalInstance'];

		var modalInstance = $modal.open({
			templateUrl: 'app/routes/dreams/deadlineModal.html',
			controller: modalController,
		});

		return modalInstance;
	}
  });
