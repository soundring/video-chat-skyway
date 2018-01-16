let express = require('express');
let app = express();

app.use(express.static('public', { hidden: true }));

app.listen(process.env.PORT || 8000);