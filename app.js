

let express = require('express');
let app = express();


app.use(express.static('public', { hidden: true }));



const port = 8000;
app.listen(process.env.PORT || port, () => {
  console.info('Listening on ' + port);
});