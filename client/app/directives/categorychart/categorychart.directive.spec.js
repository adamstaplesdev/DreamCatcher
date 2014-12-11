'use strict';

describe('Directive: categorychart', function () {

  // load the directive's module and view
  beforeEach(module('dreamCatcherApp'));
  beforeEach(module('app/directives/categorychart/categorychart.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<categorychart></categorychart>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the categorychart directive');
  }));
});