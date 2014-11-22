'use strict';

angular.module('dreamCatcherApp')
  .factory('goalFactory', ['$http',function ($http) {

  	//factories are typically used for data processing. In this case, we just define a json object and return it,
  	//and any controller (or even other factory) that injects 'goalFactory' will be able to use all of the functions
  	//and variables that we define here.

    var factory = {};

    //any other controller/factory can now access goalFactory.meaningOfLife and it will be this value.
    factory.meaningOfLife = 42;

    //any other controller/factory can now call goalFactory.testEndpoint() and it will call this function.
    factory.testEndpoint = function() {
      return $http.get("http://localhost:9000/api/goals");
    };

    return factory;
  }]);
