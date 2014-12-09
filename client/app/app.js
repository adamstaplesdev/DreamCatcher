'use strict';

angular.module('dreamCatcherApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap'
])
  .constant('serverUrl', "http://localhost:9000/")
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      // This seems like a good idea, but it's also causing lots
      // of problems with the auto redirecting, so we'll set it
      // up so that instead of auto-redirecting here, it auto-redirects
      // to the overview page
      responseError: function(response) {
        if(response.status === 401) {
          // $location.path('/login');
          // remove any stale tokens
          // $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(['$rootScope', '$location', 'Auth', '$cookieStore', function ($rootScope, $location, Auth, $cookieStore) {

    //On first run, we want to send the user to the overview page if they're not logged in, and to their home
    //page if they are logged in
    //I may have to change this so that it allows logging in via cookies, not sure.
    // Auth.isLoggedInAsync(function(loggedIn) {
    //   // console.log("Logged in?", loggedIn);
    //   if (!loggedIn) {
    //     if (console.log($cookieStore.get('token'))) {
    //       // console.log("User has a cookie. They're probably logged in.");
    //     }
    //     $location.path('/overview');
    //   }
    // });
    var firstTime = true;
    
    $rootScope.$on('$stateChangeStart', function (event, next) {
      // Redirect to login if route requires auth and you're not logged in
      Auth.isLoggedInAsync(function(loggedIn) {
        // console.log('Is the user logged in?', loggedIn);
        if (next.authenticate && !loggedIn) {
          if (firstTime) {
            $location.path('/overview');
            firstTime = false;
          }
          else {
            $location.path('/login');          
          }
          console.log("User needs to log in to see this page.")
        }
      });

      $rootScope.currentRoute = next.url;
      if (next.url === '/overview') {
			$rootScope.viewportWidth = 'col-lg-12';
    		$rootScope.overviewWrapper = "overview-wrapper"
    		$rootScope.containerPadding = {'padding':'0px'}
    		$rootScope.breadcrumbs = "hide"
      }
	  else if (next.url === '/signup'){
			$rootScope.breadcrumbs = "hide"
	  }
      else {
        $rootScope.viewportWidth = 'col-lg-10';
        $rootScope.overviewWrapper = ""
		    $rootScope.containerPadding = {}
		    $rootScope.breadcrumbs = ""
      }
    });

    $rootScope.changeRoute = function(path) {
      $location.url(path);
    };

    $rootScope.logout = function() {
      Auth.logout();
      $location.path('/overview');
    }
  }]);