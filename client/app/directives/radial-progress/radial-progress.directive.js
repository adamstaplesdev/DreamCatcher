'use strict';

angular.module('dreamCatcherApp')
  .directive('radialProgress', function () {
    return {
      //This is to tell angular where the html template for this directive is.
      //Note that the css for this directive is found in radial-progress.less
      templateUrl: 'app/directives/radial-progress/radial-progress.html',
      //This next line tells angular how we want to use our directive, in this case, I want to define a new element, so I choose 'E'.
      //The other one that we may use from time to time is 'A', for attribute. There are two others, but they don't get used much.
      restrict: 'E',
      //This tells angular to isolate the scope of the directive from the scope of the controller that calls it. Basically, it makes
      //the directive have its own scope. If we didn't have 'scope' defined here, angular would just share the scope of the controller
      //that calls the directive with the directive itself. This can be nice sometimes, but also can cause weird name collisions and
      //other things like that at times
      scope: {
        //Here, we're defining variables on the scope that get passed in as attributes on the html. The name (ie 'percentage') is what
        //the variable will be named on the scope (so in the directive, we would access it via $scope.percentage), and the following
        //symbol tells angular how to interact with it. '=' is two way databinding, meaning that if we change the value of the variable
        //in the directive, it will also be changed in the controller that called it and vice-versa. If we use '@', then angular copies
        //the value from the controller into the directive, but any changes by the directive won't affect the controller. Finally, we can
        //use '&', which passes a function from the controller in to the directive. When the directive calls it, it will be called on the
        //controller's scope, not on the directive's. That last one doesn't tend to be used as much.
        //The values for these variables are specified in the html. The following line calls this directive in the home.html
        //   <radial-progress percentage="progress" color="progressColor"></radial-progress>
        //Note the attributes 'percentage' and 'color'. So because we define these two attributes as being two way binding in the next
        //couple of lines, changing $scope.percentage from the directive will also change $scope.progress in the HomeCtrl, and changing
        //$scope.progress in HomeCtrl will change $scope.percentage in the directive. 
      	percentage: '=',
        color: '='
      },
      //And then we define a custom controller for our directive. This is the same as any other controller in angular.
      controller: function($scope) {
        //create a default color, which can be overwritten if
        //the user specifies something different
        $scope.background = {
          'background-color':'#11910A'
        }

        //$watch will watch for changes in the value of the variable specified ($scope.color). Anytime it changes, it calls the function specified
        $scope.$watch('color', function() {
          //define a new style dynamically to change the circle and percentage color
          $scope.background = {
            //these are the css attributes of the style that we're assigning to the circle. Note the need for single quotes around hyphenated names.
            'background-color': $scope.color
          };

          $scope.percentageColor = {
            color: $scope.color
          };
        });
      }
      //We can also define a linking function for our directive (which is actually what yeoman generates by default). This can sometimes be
      //easier than a controller (particularly if you're doing DOM manipulation), but in this case it wasn't, so I didn't use it.
    };
  });