const { getNamespace } = require('continuation-local-storage');
const dirtyPromise = require('bluebird');
const assert = require('assert');

module.exports = (req) => new dirtyPromise(resolve => {
  setTimeout(() => {
    const reqId = getNamespace('request').get('reqId');
    console.log('service 2 module end %s', reqId * 100);
    assert(reqId === req.headers['x-request-id']);
    resolve(reqId)
  }, Math.floor(Math.random() * Math.floor(2000)));
})