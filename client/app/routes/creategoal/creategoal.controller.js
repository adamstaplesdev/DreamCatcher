'use strict';

angular.module('dreamCatcherApp')
	.controller('CreategoalCtrl', ['$scope', '$modal', 'goalFactory', 'navchain', function ($scope, $modal, goalFactory, navchain) {

		//initialize variables
		//initialize the goal with some helpful default values
		$scope.goal = {
			name: '',
			type: 'habit', 
			subgoals: []
		};

		//some variables for the datepicker
		$scope.opened = {};
		$scope.today = new Date();
		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};

		//and now some default variables for the reminders and frequency fields
		$scope.hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
		$scope.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		$scope.dates = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];

		//open the date picker
		$scope.open = function($event, picker) {
			//picker determines which of the two pickers it is
			$event.preventDefault();
			$event.stopPropagation();
			if (picker) {
				$scope.opened.endpicker = true;
				$scope.opened.startpicker = false;
			}
			else {
				$scope.opened.startpicker = true;
				$scope.opened.endpicker = false;
			}
		};

		$scope.openGoalDate = function($event, picker, goal) {
			$event.preventDefault();
			$event.stopPropagation();
			goal.opened = {};
			if (picker) {
				goal.opened.endpicker = true;
			}
			else {
				goal.opened.startpicker = true;
			}
		}

		//appends a new empty goal object to the subgoals array, which the user can then create or delete
		$scope.addSubGoal = function() {
			var subgoal = {
				name: '',
				type: 'habit',
				expand: true,
				frequency: {}
			};
			$scope.goal.subgoals.push(subgoal);
		};

		$scope.deleteSubGoal = function(index) {
			$scope.goal.subgoals.splice(index, 1);
		};

		$scope.toggleGoalVisibility = function(goal) {
			goal.expand = !goal.expand;
		};

		$scope.changeType = function(type) {
			console.log(type);
			$scope.goal.type = type
		};

		$scope.toggleFrequency = function(goal, hour) {
			if (!goal.frequency[goal.frequencyType])
				goal.frequency[goal.frequencyType] = [];
			if (goal.frequency[goal.frequencyType].indexOf(hour) == -1)
				goal.frequency[goal.frequencyType].push(hour);
			else
				goal.frequency[goal.frequencyType].splice(goal.frequency[goal.frequencyType].indexOf(hour), 1);
			console.log(goal.frequency);
		};

		$scope.postGoal = function() {
			console.log($scope.goal);

			//do some data validation here
			if (!$scope.goal.name) {
				$scope.errorModal('Invalid Name', 'You have not specified a name for your goal. You must enter a name for your goal.');
				return;
			}

			//post the actual goal.
			goalFactory.postGoal($scope.goal).then(function(goal) {
				//update the goal so that it has the id
				$scope.goal = goal;

				var modalController = function($scope, $modalInstance, goal) {
					$scope.goal = goal;

					$scope.title='Your Goal was Successfully Created';
					$scope.message='What would you like to do next?';

					$scope.returnToPrevious = function() {
						$modalInstance.close();
						$scope.changeRoute('/' + navchain.chain.top.type + 's/' + navchain.chain.top.data._id);
					};

					$scope.goToDetails = function() {
						$modalInstance.close();
						$scope.changeRoute('/goals/'+$scope.goal._id);
					};

					$scope.buttons = [
						{
							text: 'Return to Details Page',
							handler: $scope.returnToPrevious
						},
						{
							text: 'Go to Details Page of New Goal',
							handler: $scope.goToDetails
						}
					];

					$scope.determineButtonWidthClass = function(button) {
						if (button.text.length > 12)
							return 'col-sm-5';
						return 'col-sm-2';
					};
				}

				//use $inject to make it minification safe
				modalController.$inject = ['$scope', '$modalInstance', 'goal'];

				var modalInstance = $modal.open({
					templateUrl: 'app/routes/create/modal.html',
					backdrop: 'static', 
					controller: modalController,
					resolve: {
						goal: function() {
							return $scope.goal;
						}
					}
				});
				
				navchain.reload();

			}, function() {
				console.log('Failed to post the goal.');
				$scope.errorModal('Error', 'There was an error and your goal could not be created.');
			});
		};

		$scope.errorModal = function(title, message) {
			var modalController = function($scope, $modalInstance, title, message) {
				$scope.title = title;
				$scope.message = message;

				$scope.close = function() {
					$modalInstance.close();
				}

				$scope.buttons = [
					{
						text: 'Ok',
						handler: $scope.close
					}
				];

				$scope.determineButtonWidthClass = function(button) {
					if (button.text.length > 12)
						return 'col-sm-5';
					return 'col-sm-2';
				};
			}

			//use $inject to make it minification safe
			modalController.$inject = ['$scope', '$modalInstance', 'title', 'message'];

			var modalInstance = $modal.open({
				templateUrl: 'app/routes/create/modal.html',
				controller: modalController,
				resolve: {
					title: function() {
						return title;
					},
					message: function() {
						return message;
					}
				}
			});

		}


	}]);
