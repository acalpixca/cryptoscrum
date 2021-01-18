/* const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
}) */

const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;


// esto es nuevo
require('./router/main')(app);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname + '/public'));


// viewed at http://localhost:8080
/*
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/web/index.html'));
});*/

app.listen(port, () => {
  console.log(`coinparty app listening at http://localhost:${port}`)
});
