'use strict';

describe('Controller: CreategoalCtrl', function () {

  // load the controller's module
  beforeEach(module('dreamCatcherApp'));

  var CreategoalCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreategoalCtrl = $controller('CreategoalCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
