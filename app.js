var express = require('express');
var app = express();

app.use(express.static('public', { hidden: true }));

app.listen(process.env.PORT || 13000);