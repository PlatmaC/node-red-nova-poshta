const helper = require('node-red-node-test-helper');
const lowerNode = require('../nova-poshta.js');

describe('nova-poshta Node', function () {
  afterEach(function () {
    helper.unload();
  });

  it('should be loaded', function (done) {
    const flow = [{ id: 'n1', type: 'nova-poshta', name: 'nova-poshta' }];
    helper.load(lowerNode, flow, function () {
      const n1 = helper.getNode('n1');
      n1.should.have.property('name', 'nova-poshta');
      done();
    });
  });
});
