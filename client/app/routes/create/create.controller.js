'use strict';

angular.module('dreamCatcherApp')
	.controller('CreateCtrl', ['$scope', '$modal', 'dreamFactory', function ($scope, $modal, dreamFactory) {

		//initialize variables
		//initialize the dream with some helpful default values
		$scope.dream = {
			name: 'New Dream',
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
			console.log($scope.categories);
			$scope.category = $scope.categories[0].value;

		}, function() {
			$scope.errorModal('Could Not Retrieve Custom User Categories', 'There was an error fetching your custom user categories, if you have created any. You can still create new dreams and use new categories, but your custom categories will not appear as options in the drop down. You\'ll have to type them in manually if you want a custom category.');
		})

		console.log($scope.dream);

		//appends a new empty goal object to the subgoals array, which the user can then create or delete
		$scope.addSubGoal = function() {
			var subgoal = {
				name: 'New Sub-Goal',
				type: 'habit',
				expand: true
			};
			$scope.dream.subgoals.push(subgoal);
		};

		$scope.deleteSubGoal = function(index) {
			$scope.dream.subgoals.splice(index, 1);
		};

		$scope.toggleGoalVisibility = function(goal) {
			goal.expand = !goal.expand;
		}

		$scope.changeType = function(type) {
			console.log(type);
			$scope.dream.type = type
		}

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
