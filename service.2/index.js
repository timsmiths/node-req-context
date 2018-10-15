const assert = require('assert');
const { createNamespace } = require('continuation-local-storage');
const session = createNamespace('request');
const express = require('express');
const requiredModule = require('./module');

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
  requiredModule(req)
    .then(reqId => {
      res.json({
        reqId
      });
    })
    .catch(err => next(err));
});

app.use((err, req, res) => {
  console.log(err);
  process.exit(1);
});

app.listen(3001, () => {
  console.log('Listening on port 3001');
});