'use strict';

angular.module('dreamCatcherApp')
	.controller('CreateCtrl', ['$scope', '$modal', 'dreamFactory', 'navchain', function ($scope, $modal, dreamFactory, navchain) {

		//initialize variables
		//initialize the dream with some helpful default values
		$scope.dream = {
			name: '',
			type: 'habit', 
			subgoals: []
		};
		//provide a few default categories - set this up so that these are there at least until the request comes back
		$scope.categories = [
			{
				label: 'Other',
				value: 'custom'
			}
		];

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

		//initialize a default category
		$scope.category = $scope.categories[0].value;

		//fetch their actual user categories from the server
		dreamFactory.getUserCategories().then(function(userCategories){
			for (var i = 0; i < userCategories.length; i++) {
				var category = {
					label: userCategories[i],
					value: userCategories[i]
				};
				$scope.categories.push(category);
			}
			$scope.categories.sort(function(a, b) {
				return a.label.localeCompare(b.label);
			});
			$scope.category = $scope.categories[0].value;

		}, function() {
			$scope.errorModal('Could Not Retrieve Custom User Categories', 'There was an error fetching your custom user categories, if you have created any. You can still create new dreams and use new categories, but your custom categories will not appear as options in the drop down. You\'ll have to type them in manually if you want a custom category.');
		})

		//appends a new empty goal object to the subgoals array, which the user can then create or delete
		$scope.addSubGoal = function() {
			var subgoal = {
				name: '',
				type: 'habit',
				expand: true,
				frequency: {}
			};
			$scope.dream.subgoals.push(subgoal);
		};

		$scope.deleteSubGoal = function(index) {
			$scope.dream.subgoals.splice(index, 1);
		};

		$scope.toggleGoalVisibility = function(goal) {
			goal.expand = !goal.expand;
		};

		$scope.changeType = function(type) {
			console.log(type);
			$scope.dream.type = type
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

		$scope.postDream = function() {
			console.log($scope.dream);

			//do some data validation here
			if (!$scope.dream.name) {
				$scope.errorModal('Invalid Name', 'You have not specified a name for your dream. You must enter a name for your dream.');
				return;
			}

			//assign the dream its category
			if ($scope.category === 'custom') {
				if (!$scope.customCategory) {
					//if they haven't defined a custom category
					$scope.errorModal('Invalid Category', 'You have selected the option to define a custom category, but have not defined a category.');
					return;
				}
				//if we make it this far, they've got a category
				$scope.dream.category = $scope.customCategory;
			}
			else {
				//they just chose something from the drop down, so we include that
				$scope.dream.category = $scope.category;
			}

			//also validate all of the sub-goal data.
			if ($scope.dream.subgoals) {
				//check all of the dreams
				for (var i = 0; i < $scope.dream.subgoals.length; i++) {
					var goal = $scope.dream.subgoals[i];
					if (!goal.name) {
						$scope.errorModal('Invalid Sub-Goal Name', 'You have not specified a name for one of the sub-goals of your dream.');
						return;
					}
					if (goal.type == 'habit') {
						goal.habit = true;
						if (!goal.startDate) {
							//if there is no start date, just assume today
							goal.startDate = new Date();
						}
						if (!goal.endDate) {
							//this one is a problem, since we don't want to just
							//loop on into infinity
							$scope.errorModal('Infinite Goal', 'Your subgoal of "' + goal.name + '" does not have an end date. Please add an end date and re-submit.');
							return;
						}

						//also make sure that they marked at least one frequency
						if (!goal.frequency) {
							$scope.errorModal('No Goal Frequency', 'You haven\'t told us how often you\'d like to complete your goal "'+goal.name+'"! Please select when you would like to complete it.');
							return;
						}
						else if (!goal.frequencyType || !goal.frequency[goal.frequencyType] || !goal.frequency[goal.frequencyType].length) {
							$scope.errorModal('No Goal Frequency', 'You haven\'t told us how often you\'d like to complete your goal "'+goal.name+'"! Please select when you would like to complete it.');
							return;
						}

						//and now calculate the maximum progress, given how many things they checked
						if (goal.frequencyType == 'daily') {
							var numberOfDaysInGoal = Math.round((goal.endDate - goal.startDate) / (1000 * 60 * 60 * 24));
							goal.amount = goal.frequency[goal.frequencyType].length * numberOfDaysInGoal;
						}
						else if (goal.frequencyType == 'weekly') {
							//This is VERY much not exact, and will result in habit-forming goals that it's impossible to complete
							//(basically, it assumes that the time frame is an integer number of weeks, which is almost bound to not be true a good portion of the time)
							var numberOfWeeksInGoal = Math.round((goal.endDate - goal.startDate) / (1000 * 60 * 60 * 24 * 7));
							goal.amount = goal.frequency.weekly.length * numberOfWeeksInGoal;
						}
						else {
							//monthly progress
							var numberOfMonthsInGoal = Math.round((goal.endDate - goal.startDate) / (1000 * 60 * 60 * 24 * 7));
							goal.amount = goal.frequency.monthly.length * numberOfMonthsInGoal;
						}

						//ensure that there's always at least one progress.
						if (goal.amount <= 0) {
							goal.amount = 1;
						}

					}
					else if (goal.type == 'deadline') {
						goal.deadline = true;
						goal.amount = 1;
						//if there's no start date, add one
						if (!goal.startDate) {
							goal.startDate = new Date();
						}

						//make sure that they have an end date
						if (!goal.endDate) {
							$scope.errorModal('Infinite Goal', 'Your subgoal of "' + goal.name + '" has no end date! Please set an end date and re-submit.');
							return;
						}
					}
					else if (goal.type == 'quantitative') {
						goal.quantitative = true;
						if (!goal.amount) {
							$scope.errorModal('No Goal Amount', 'Your subgoal "' + goal.name + '" does not include a goal amount. Please add one and try again');
							return;
						}
						if (!goal.progressType) {
							$scope.errorModal('Missing Progress Units', 'No sub-goal unit was set for your sub-goal "' + goal.name +'." Please set a unit (or select "No Units") and try again.');
							return;
						}
						else if (goal.progressType=='Other') {
							if (!goal.customCategory) {
								$scope.errorModal('No Custom Units', 'You selected that you wanted a custom unit for the progress of your sub-goal "' + goal.name + '," but never told us what unit you wanted to use. Please either fill in the custom field, or choose a different progress unit (or "No Units") and try again.');
								return;
							}
							goal.progressType = goal.customCategory;
						}

					}
					else {
						//what even happened?
						$scope.errorModal('Invalid Sub-Goal Type', 'Your sub-goal "' + goal.name + '" has an invalid type. Please select a type and try again.');
						return;
					}
				}
			}


			//post the actual dream.
			dreamFactory.postDream($scope.dream).then(function(dream) {
				//update the dream so that it has the id
				$scope.dream = dream;

				var modalController = function($scope, $modalInstance, dream) {
					$scope.dream = dream;

					$scope.title='Your Dream was Successfully Created';
					$scope.message='What would you like to do next?';

					$scope.returnToHome = function() {
						$modalInstance.close();
						$scope.changeRoute('/');
					};

					$scope.goToDetails = function() {
						$modalInstance.close();
						$scope.changeRoute('/dreams/'+$scope.dream._id);
					};

					$scope.buttons = [
						{
							text: 'Return to Home Page',
							handler: $scope.returnToHome
						},
						{
							text: 'Go to Details Page of Dream',
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
				modalController.$inject = ['$scope', '$modalInstance', 'dream'];

				var modalInstance = $modal.open({
					templateUrl: 'app/routes/create/modal.html',
					backdrop: 'static', 
					controller: modalController,
					resolve: {
						dream: function() {
							return $scope.dream;
						}
					}
				});
				
				navchain.reload();

			}, function() {
				console.log('Failed to post the dream.');
				$scope.errorModal('Error', 'There was an error and your dream could not be created.');
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
