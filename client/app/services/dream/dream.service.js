'use strict';

angular.module('dreamCatcherApp')
	.factory('dreamFactory', ['$http', 'serverUrl', '$q', 'goalFactory', function ($http, serverUrl, $q, goalFactory) {

		var factory = {};

		factory.acceptedDreamFields = [
			'name',
			'category',
			'description',
			'deadline',
			'startDate',
			'endDate',
			'status',
		];

		factory.httpStripDream = function(dream) {
			//basically, this function loops over the object and strips off any fields that aren't approved
			for (var key in dream) {
				if (factory.acceptedDreamFields.indexOf(key) == -1) {
					delete dream[key];
				}
			}
		}

		factory.setParentIdsOnSubgoals = function(dream) {
			if (dream.subgoals) {
				for (var i = 0; i < dream.subgoals.length; i++) {
					dream.subgoals[i].parentId = dream.id;
					dream.subgoals[i].parentType = 'dream';
				}
			}
		}

		factory.getUserCategories = function() {
			var defer = $q.defer();
			$http.get(serverUrl + 'api/dreams/categories').success(function(categories) {
				defer.resolve(categories);
			}).error(function() {
				defer.reject('Could not get user categories');
			});
			return defer.promise;
		}

		factory.getDreams = function() {
			var defer = $q.defer();
			$http.get(serverUrl + 'api/dreams').success(function(dreams) {
				defer.resolve(dreams);
			}).error(function() {
				defer.reject('Could not get dreams');
			});
			return defer.promise;
		}

		factory.getDream = function(id, includeSubGoals) {

			//configure the query params
			var options = {};
			options.params = {
				includeSubGoals: (includeSubGoals) ? true : false
			}

			//make the actual request
			if (id) {
				if (includeSubGoals) {
					var defer = $q.defer();
					$http.get(serverUrl + 'api/dreams/' + id).success(function(dream) {
						//get all of the 
						goalFactory.getGoals(dream.id, 'dream').then(function(goals) {
							dream.subgoals = goals;
							defer.resolve(dream);
						}, function() {
							defer.reject('Could not get sub goal data');
						});
					}).error(function() {
						defer.reject('http request for dream failed');
					});
					return defer.promise;
				}
				else {
					var defer = $q.defer;
					$http.get(serverUrl + 'api/dreams/' + id, null, options).then(function(dream) {
						defer.resolve(dream);
					}).error(function() {
						defer.reject('Could not get dream');
					});
					return defer.promise;
				}
			}
		}

		factory.postDream = function(dream) {
			//make an array of promises to wait on
			var promises = [];
			var copy = angular.copy(dream);

			//and now post the subdreams and add their promise
			if (dream.subgoals && dream.subgoals.length) {
				//first set the parent information so we can get it back later
				factory.setParentIdsOnSubgoals(copy);
				//now actually post them
				promises[1] = goalFactory.postGoals(copy.subgoals);
			}
			
			//strip the extra fields off
			factory.httpStripDream(copy);

			//post the main dream and add its promise
			var defer = $q.defer();
			$http.post(serverUrl + 'api/dreams', copy).success(function(data) {
				defer.resolve(data);
			}).error(function() {
				defer.reject('The dream could not be posted.')
			});
			promises[0] = defer.promise;

			//now handle the actual promises logic
			var defer = $q.defer();
			$q.all(promises, function(data) {
				//figure out if we had subgoals or not
				var postedDream = data[0];
				if (data.length > 1) {
					//there were subgoals
					postedDream.subgoals = data[1];
				}
				//and now return the actual dream object
				defer.resolve(postedDream);
			}, function() {
				defer.reject('Either the dream or a subgoal failed to post');
			});
			return defer.promise;				
		}

		factory.putDream = function(dream) {
			var promises = [];
			var copy = angular.copy(dream);

			
			if (dream.subgoals && dream.subgoals.length) {
				factory.setParentIdsOnSubgoals(copy);
				promises[1] = goalFactory.putGoals(copy.subgoals);
			}
			factory.httpStripDream(copy);
			promises[0] = $http.put(serverUrl + 'api/dreams/' + copy.id, copy);

			var defer = $q.defer();

			$q.all(promises, function(data) {
				var postedDream = data[0];
				if (data.length > 1) {
					postedDream.subgoals = data[1];
				}
				defer.resolve(postedDream);
			}, function() {
				defer.reject('Either the dream or subgoal failed to put');
			});

			return defer.promise;
		}

		factory.deleteDream = function(dream) {
			var defer = $q.defer();
			$http.delete(serverUrl + 'api/dreams/' + dream.id).success(function() {
				defer.resolve();
			}).error(function() {
				defer.reject('Could not delete the given dream');
			});
			return defer.promise;
		}

		return factory;
	}]);
