'use strict';

describe('Service: navchain', function () {

  // load the service's module
  beforeEach(module('dreamCatcherApp'));

  // instantiate service
  var navchain;
  beforeEach(inject(function (_navchain_) {
    navchain = _navchain_;
  }));

  it('should do something', function () {
    expect(!!navchain).toBe(true);
  });

});
