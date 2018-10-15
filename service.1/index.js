const assert = require('assert');
const axios = require('axios');
const { createNamespace } = require('continuation-local-storage');
const session = createNamespace('request');
const express = require('express');

const app = express();

// Assuming we have our express app in `app`
app.use((req, res, next) => {
  session.run(() => next());
});

// And once we have authenticated the user
app.use((req, res, next) => {
  session.set('reqId', req.headers['x-request-id']);
  next();
});

app.use((req, res, next) => {
  const reqId = session.get('reqId');
  assert(reqId === req.headers['x-request-id']);

  axios({
    method: 'GET',
    headers: { 'x-request-id': reqId },
    url: 'http://localhost:3001',
  })
    .then(res2 => {
      assert(reqId === res2.data.reqId)
      console.log(res2.data.reqId)
      return res.json({
        reqId: res2.data.reqId,
      });
    })
    .catch(err => next(err));
});

app.use((err, req, res) => {
  console.log(err);
  process.exit(1);
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});