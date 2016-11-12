var express = require('express');
var app = express();
var path = require('path');
var quick = require('./public/quickstart.js');
var bodyParser = require('body-parser');
const EventEmitter = require('events');
app.use(bodyParser.json());
app.get('/', function(req, res) {    res.sendFile(path.join(__dirname + '/view/test4.html'));
    app.use(express.static(path.join(__dirname + '/view')));
});
app.post('/chat', function(req, res) {
  quick(req.body.text, function (value) {
  	res.send(value);
  });
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
app.use('/public', express.static('public'));
app.use('/youtube', express.static('youtube'));
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json 

