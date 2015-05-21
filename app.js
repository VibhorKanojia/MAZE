
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

var LastClientID = 0;
io.on('connection', function(socket){
  io.to(socket.id).emit('SocketID message', socket.id);
  
  socket.on('Get ClientID', function(socketid){
    clients[LastClientID] = socketid;
    io.to(socketid).emit('Set ClientID', LastClientID);
    console.log("Sent " + LastClientID);
    LastClientID += 2;
  });

  socket.on('Connect Code', function(code){
    var index;
    for (index = 0 ; index < LastClientID ; index++){
      if (clients[index] == code.connTo){
        clients[index+1] = code.myID;
        console.log(index + " matched");
        break;
      }
    }
    io.to(clients[index+1]).emit('Set ID', index+1);
  });

  socket.on('current matrix', function(data){
    if (data.senderID == -1){
      cellList.push({'cells' : data.matrix.cells.slice()});
      cellList.push({'cells' : data.matrix.cells.slice()});
    }
    else{
      if (data.senderID %2 == 0){
        cellList[data.senderID] = {'cells' : data.matrix.cells.slice()};
        cellList[data.senderID +1] = {'cells' : data.matrix.cells.slice()};
        io.to(clients[data.senderID+1]).emit('Change Difficulty', data.diff_flag); 
      }
      else{
        cellList[data.senderID] = {'cells' : data.matrix.cells.slice()};
        cellList[data.senderID - 1] = {'cells' : data.matrix.cells.slice()}; 
        io.to(clients[data.senderID-1]).emit('Change Difficulty', data.diff_flag);
      }
    }
  });


  socket.on('Request Maze', function(data){
    if (data % 2 == 0){
      io.to(clients[data]).emit('Use matrix', cellList[data+1]);
    }
    else {
      io.to(clients[data]).emit('Use matrix', cellList[data-1]);
    }
  });


  socket.on('key code to server', function(msg){
    var senderID = msg.clientID;
    if (senderID % 2 == 0){
      io.to(clients[senderID+1]).emit('move blocks', {'val':msg.keycode, 'player':senderID+1});
    }
    else {
      io.to(clients[senderID-1]).emit('move blocks', {'val': msg.keycode, 'player':senderID});
    }
  });


  socket.on('Connect Code', function(code){
    console.log(code);
  });
});
  
http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});









