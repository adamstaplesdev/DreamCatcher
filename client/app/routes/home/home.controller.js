'use strict';

angular.module('dreamCatcherApp')
  .controller('HomeCtrl', ['$scope', 'navchain', '$timeout', function ($scope, navchain, $timeout) {

    //The $scope is used to do all of the data binding in angular. If you look at home.html, you'll see a few places where it uses
    //{{nameOfVariableHere}} in the html. What that does is look on the $scope for a variable with that name. For example, anywhere
    //where you see {{dream}} or {{dream.description}} or {{dream.deadline}} in the htl, it's actually looking on the scope until
    //it finds the 'dream' variable that we define in the lines below, then replacing the weird double braces with the contents
    //of the object referenced.
  	$scope.chain = navchain.chain;

    //Factories and services are used to do all data processing in angular, including http requests. If you look at 
    //client/app/services/goal/goal.service.js, you'll see where 'goalFactory' is defined as a variable inside of this
    //angular module. Then, if you look at the top of this controller, you'll see where we included 'goalFactory' as a parameter
    //variable in this scope. Angular sees 'goalFactory', looks in the list of defined module variables, and finds the factory
    //that we defined in goal.service.js. We can then use that factory (and the functions on it, in this case, testEndpoint())
    //just as we would use any other variable.
  // 	dreamFactory.getDreams().then(function(data) {
  // 		$scope.dreams = data;
		// console.log(data);
  // 	}, function(data) {
  // 		console.log("failed");
  // 	});


    //these next fiew lines are just here to demonstrate how the data binding works between the controller and the radial-progress
    //directive. They are the reason that the radial progress bar changes color and moves up to 85 %. The radial-progress directive
    //can be found in line 8 on the home.html (at least when I'm writing this, though it will move since it actually should be on
    //a goal's page, not a dream's). You can see where this directive is defined on the angular module at client/app/directives/radial-progress
  	//$scope.progress=52;
    //$scope.progressColor = '#4A4AD9';

    //$timeout is used to wait a specific amount of time. The format is $timeout(function() {}, timeToWait). The function can do
    //pretty much whatever you want it to. The time to wait is how long to wait (in milliseconds) before executing the function.
    //The following code will wait for three seconds, then update the progress and progressColor variables.
    //$timeout(function() {
      //$scope.progress=85;
      //$scope.progressColor =  '#E00B39';
    //}, 3000);


  }]);
