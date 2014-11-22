'use strict';

describe('Service: goal', function () {

  // load the service's module
  beforeEach(module('dreamCatcherApp'));

  // instantiate service
  var goal;
  beforeEach(inject(function (_goal_) {
    goal = _goal_;
  }));

  it('should do something', function () {
    expect(!!goal).toBe(true);
  });

});
