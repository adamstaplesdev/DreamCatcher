'use strict';

angular.module('dreamCatcherApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap'
])
  //this is here so that we can easily change all of the urls from development to production later on.
  .constant('serverUrl', "http://localhost:9000/")
  //This is where the main route configuration gets done. Basically, if angular doesn't recognize a route, it sends them to the home page.
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  }])

  //I don't love this function, but it's the easiest way that I know of to use angular features in the index.html. Think of this
  //next little bit as a controller that goes with the index.html
  .run(['$rootScope','$location', function($rootScope, $location) {
    
    //this function allows us to track our current url for breadcrumbs
    //and knowing how wide the view box should be
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      $rootScope.currentRoute = toState.url;
      if (toState.url === '/overview') {
        //we're on the overview page, so we should change the column width to be full screen
        $rootScope.viewportWidth = 'col-lg-12';
		$rootScope.overviewWrapper = "overview-wrapper"
		$rootScope.containerPadding = {'padding':'0px'}
		$rootScope.breadcrumbs = "hide"
      }
      else {
        //we have the navigation bar to worry about, so the view needs to take up a little less space.
        $rootScope.viewportWidth = 'col-lg-10';
		$rootScope.overviewWrapper = ""
		$rootScope.containerPadding = {}
		$rootScope.breadcrumbs = ""
      }
    });

    //this function can be used from anywhere in the javascript
    //or html to change routes
    $rootScope.changeRoute = function(path) {
      $location.url(path);
    };

  }]);