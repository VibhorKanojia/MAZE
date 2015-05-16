
/*
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.get('/', function (req, res) {
      res.sendfile(__dirname + '/public/Maze.html');
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

*/

var express = require('express')
var app = express()
var path = require("path");
var http = require('http').Server(app);
var io = require('socket.io').listen(http);


var clients = [];


app.use(express.static(path.join(__dirname, 'public')));

app.use("/styles",  express.static(__dirname + '/public/stylesheets'));
app.use("/scripts", express.static(__dirname + '/public/javascripts'));
app.use("/images",  express.static(__dirname + '/public/images'));


app.get('/', function (req, res) {
      res.sendFile(__dirname + '/public/Maze.html');
});

var cells = [];

var myobject={'cells':[]};
var cellList = [];

io.on('connection', function(socket){
  clients[clients.length] = socket.id;
  var curID = clients.length -1;
  console.log(socket.id);
  io.to(clients[clients.length-1]).emit('Client ID message', {clientID : curID , socketID  : socket.id});
  if (clients.length > 0){
    for (var i = 0 ; i < clients.length ; i++){
      io.to(clients[i]).emit('Use matrix', cellList[i-1]);
    }
  }
  /*
  socket.on('div message', function(msg){
    //io.toemit('chat message', msg);
    console.log("message received")
    io.to(clients[1]).emit('server message', msg);
    console.log('message: ' + msg);
  });
  */
  socket.on('current matrix', function(data){
    cellList.push({'cells' : data.cells.slice()});
    cellList.push({'cells' : data.cells.slice()});
    //myobject.cells = data.cells.slice();
    //console.log(myobject.cells.length);
  });





  socket.on('key code to server', function(msg){
    var senderID = msg.clientID;
    if (senderID % 2 == 0){
      io.to(clients[senderID]).emit('move blocks', {'val': msg.keycode, 'player': senderID});
      io.to(clients[senderID+1]).emit('move blocks', {'val':msg.keycode, 'player':senderID+1});
    }
    else {
      io.to(clients[senderID]).emit('move blocks', {'val': msg.keycode, 'player':senderID-1});
      io.to(clients[senderID-1]).emit('move blocks', {'val': msg.keycode, 'player':senderID});
    }
  });
  //socket.emit('servermsg',"HEldl");
});
  
http.listen(3000, function(){
  console.log('listening on *:3000');
});









