const express = require('express');
const app = express();

const api = require('./api')
const view = require('./view')

app.use('/api', api);
app.use('/', view);

module.exports = app;