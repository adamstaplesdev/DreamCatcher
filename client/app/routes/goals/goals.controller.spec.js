'use strict';

describe('Controller: GoalsCtrl', function () {

  // load the controller's module
  beforeEach(module('dreamCatcherApp'));

  var GoalsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GoalsCtrl = $controller('GoalsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
