const axios = require('axios');
const assert = require('assert');

const count = 1500;

for (let i = 0; i < count; i++) {

  axios({
    method: 'GET',
    headers: { 'x-request-id': i },
    url: 'http://localhost:3000',
  })
    .then(res => {
      console.log(res.data.reqId)
      assert(i === res.data.reqId)
      return res;
    })
    .catch(err => () => {
      console.log(err);
      process.exit(1);
    });

}
