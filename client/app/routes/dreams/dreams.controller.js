'use strict';

angular.module('dreamCatcherApp')
  .controller('DreamsCtrl', function ($scope, navchain, $stateParams, dreamFactory, goalFactory, $modal) {

  	//initialize the progress color variable
  	$scope.progressColor = '#4cae4c';

  	//initialize the scope parameters to the navchain elements, in case the dream takes a moment to load
  	$scope.parent = {};
  	$scope.parent.percent = 0;
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
          dream.subgoals[i].percent = dream.subgoals[i].percent.toFixed(2);
  				maxDreamProgress += dream.subgoals[i].amount;
  			}
  		}
  		$scope.parent = dream;
  		$scope.parent.progress = totalDreamProgress;
  		$scope.parent.maxProgress = maxDreamProgress;
  		$scope.parent.percent = 100 * totalDreamProgress / maxDreamProgress;
  		$scope.parent.percent = $scope.parent.percent.toFixed(0);
  		console.log($scope.parent);
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
          goal.percent = goal.percent.toFixed(2);
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
          goal.percent = goal.percent.toFixed(2);
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
          goal.percent = goal.percent.toFixed(2);
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
