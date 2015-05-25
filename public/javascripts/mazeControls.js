/* This script lets the user control various aspects of the maze being drawn. */

var clientID;
var socketID;
var socket;
var seconds = 0;
var minutes = 0;
var connectionEstablished=0;



function getCode(){
    if (document.getElementById('getCodeButton').disabled) return;

    var connID = prompt("Please enter the code", "");
    
    socket.emit('Connect Code', {'connTo' : connID, 'myID' : socketID});
    
    socket.on('Set ID', function(clID){
        clientID = clID;
        socket.emit('Show Canvas', clientID);
        changeTime();
        drawMaze(2);
        var elem = document.getElementById('getCodeButton');
        elem.disabled = true;
        elem.style.background = "#AAA";
        connectionEstablished = 1;
        var elem2 = document.getElementById('changeDifficultyButton');
        elem2.disabled = false;
        elem2.style.removeProperty('background');
    });   
};

var clobject = {'cells':[]};

var audio = new Audio('blop.mp3');


var difficulty = 1;
var canvas_width = 601;
var canvas_height = 601;
var width = 30;
var height = 30;

var dw1 = 0;                //destroy wall player 1
var dw2 = 0;                //destroy wall player 2

var maze;
var val_right_one = 0;
var val_up_one = 0;
var val_right_two = 0;
var val_up_two = 0;
var step = (canvas_width-1) / Math.max(width, height);

var canvas = document.createElement("canvas"),
        context = canvas.getContext('2d'),
        gradient = context.createLinearGradient(0, 0, canvas_width, canvas_height);

function drawMaze(diff_flag){
    seconds = 0;
    minutes = 0;
    dw1 = 0;                //destroy wall player 1
    dw2 = 0;                //destroy wall player 2

    val_right_one = 0;                                                  //FUCKING COMPLICATED STUFF 'was' AHEAD. I fucking simplified it :P
    val_up_one = 0;
    val_right_two = 0;
    val_up_two = 0;

    document.getElementById('viewSolution').disabled=false;
    document.getElementById('breakWall').disabled = false;


    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas_width, canvas_height);
    maze = new Maze(width, height); 

    clobject.cells = maze.draw(canvas, step);
    if (diff_flag == 1){ //DIFF FLAG = 1 => difficulty changed by you
        socket.emit('current matrix', {'matrix' : clobject, 'senderID' : clientID, 'diff_flag' : diff_flag});    
    }

    else if (diff_flag == 2){   // DIFF_FLAG = 2 => when you request a matrix, happens when opponent changes level or presses refresh button
        socket.emit('Request Maze', clientID);
        
        socket.on('Use matrix', function (data){
            maze.draw(canvas,step,data);
            canvas.style.display="block";
        });
    }

    else if (diff_flag == 3){ //DIFF_FLAG =3 => refresh button pressed by you
        if (!clientID){
            socket.emit('Get ClientID', socketID);
              
            socket.on('Set ClientID', function(id){
                clientID = id;
                canvas.style.display = "none";
                prompt("Send this code to your friend. Maze will appear after your friend connects.", socketID);
                socket.emit('current matrix', {'matrix' : clobject, 'senderID' : clientID, 'diff_flag' : diff_flag});
            });
        }

        else{
            if (connectionEstablished){
                socket.emit('current matrix', {'matrix' : clobject, 'senderID' : clientID, 'diff_flag' : diff_flag});
            }
            else{
                socket.emit('current matrix', {'matrix' : clobject, 'senderID' : clientID, 'diff_flag' : diff_flag});
                prompt("Send this code to your friend. Maze will appear after your friend connects.", socketID);
            }

        }
    }    
};




function solveMaze() {
    maze.drawSolution(canvas);
    var stopFlag = 0;
    var solutionInterval = setInterval(function(){
        if (stopFlag == 1) {
            maze.drawSolution(canvas,'#FFFFFF');
            maze.drawCircle(canvas, step,val_right_two,val_up_two,2,width);
            maze.drawCircle(canvas, step,val_right_one,val_up_one,1,width);
            clearInterval(solutionInterval);
        }
        else{
            maze.drawSolution(canvas);
            stopFlag = 1;
        }

    }, (difficulty+1)*500);

    document.getElementById('viewSolution').disabled=true;
};

function changeTime(){
    var intervalID = setInterval(function() {
        if (endFlag == 1) return;
        seconds++;
        if (seconds == 60){
            seconds =0;
            minutes++;
        }
        var time = document.getElementById("time");
        if (minutes < 10){
            if (seconds < 10){
                time.innerHTML = "0"+minutes+":0"+seconds;
            }
            else if (seconds < 60){
                time.innerHTML = "0"+minutes+":"+seconds;
            }
        }
        else{
            if (seconds < 10){
                time.innerHTML = minutes+":0"+seconds;
            }
            else if (seconds < 60){
                time.innerHTML = minutes+":"+seconds;
            }   
        }
    }, 1000);
};

function changeDifficulty(flag) {
    if (document.getElementById('changeDifficultyButton').disabled) return;
    difficulty = (difficulty +1)%3;
    if (difficulty == 0){
        width = 20;
        height = 20;
    }

    else if (difficulty == 1){
        width = 30;
        height = 30;
    }

    else if (difficulty == 2){
        width = 40;
        height = 40;
    }

    context.clearRect ( 0 , 0 , canvas.width, canvas.height);
    step = (canvas_width-1) / Math.max(width, height);
    drawMaze(flag);
    
};

function moveBlocks(val, player){
if (player % 2 == 0){
    if (!(dw1 == 1)){

        switch(val){

            case 38:            
                if (maze.isValid(canvas,step,"up",val_right_one,val_up_one)){
                    maze.removeCircle(canvas,step,val_right_one,val_up_one);
                    val_up_one -=1;
                    audio.play();        
                }
                break;

            case 40:           
                if (maze.isValid(canvas,step,"down",val_right_one,val_up_one)){
                    maze.removeCircle(canvas,step,val_right_one,val_up_one);
                    val_up_one +=1;
                    audio.play();
                }
                break;

            case 37:    
                if (maze.isValid(canvas,step,"left",val_right_one,val_up_one)){
                    maze.removeCircle(canvas,step,val_right_one,val_up_one);
                    val_right_one -=1;
                    audio.play();
                }
                break;

            case 39:
                if (maze.isValid(canvas,step,"right",val_right_one,val_up_one)){
                    maze.removeCircle(canvas,step,val_right_one,val_up_one);
                    val_right_one +=1;
                    audio.play();
                }
                break;
            case 66:
                dw1++;
                break;    
        }

        maze.drawCircle(canvas, step,val_right_one,val_up_one,1,width);
        maze.drawCircle(canvas, step,val_right_two,val_up_two,2,width);
        
    }


    else{     

        switch(val){

            case 38:
                if (!maze.isValid(canvas,step,"up",val_right_one,val_up_one)){
                    maze.destroyWall(canvas,step,val_right_one,val_up_one,1,width,"up");
                    document.getElementById('breakWall').disabled = true;
                    dw1 = 2;
                }
                else{
                    dw1 = 0;
                }

                break;

            case 40:
                if (!maze.isValid(canvas,step,"down",val_right_one,val_up_one)){
                    maze.destroyWall(canvas,step,val_right_one,val_up_one,1,width,"down");
                    document.getElementById('breakWall').disabled = true;
                    dw1 = 2;
                }
                else{
                    dw1 = 0;
                }
                break;

            case 37:
                if (!maze.isValid(canvas,step,"left",val_right_one,val_up_one)){
                    maze.destroyWall(canvas,step,val_right_one,val_up_one,1,width,"left");
                    document.getElementById('breakWall').disabled = true;
                    dw1= 2;
                }
                else{
                    dw1 = 0;
                }
                break;

            case 39:
                if (!maze.isValid(canvas,step,"right",val_right_one,val_up_one)){
                    maze.destroyWall(canvas,step,val_right_one,val_up_one,1,width,"right");
                    document.getElementById('breakWall').disabled = true;
                    dw1 = 2;
                } 
                else{
                    dw1 = 0;
                }
                break;               
        }

    }
}
else {

    if (!(dw2==1)){

        switch(val){

            case 38:
                if (maze.isValid(canvas,step,"up",val_right_two,val_up_two)){
                    maze.removeCircle(canvas,step,val_right_two,val_up_two);
                    val_up_two -=1;
                }    
                break;

            case 40:
                if (maze.isValid(canvas,step,"down",val_right_two,val_up_two)){
                    maze.removeCircle(canvas,step,val_right_two,val_up_two);
                    val_up_two +=1;
                }
                break;

            case 37:
                if (maze.isValid(canvas,step,"left",val_right_two,val_up_two)){
                    maze.removeCircle(canvas,step,val_right_two,val_up_two);
                    val_right_two -=1;
                }
                break;

            case 39:
                if (maze.isValid(canvas,step,"right",val_right_two,val_up_two)){
                    maze.removeCircle(canvas,step,val_right_two,val_up_two);
                    val_right_two +=1;
                }  
                break;
            case 66:
                dw2++;
                break;      
        }

        maze.drawCircle(canvas, step,val_right_two,val_up_two,2,width);
        maze.drawCircle(canvas, step,val_right_one,val_up_one,1,width);
    }
        
    else {

        switch(val){
            case 38:
                if (!maze.isValid(canvas,step,"up",val_right_two,val_up_two)){
                    maze.destroyWall(canvas,step,val_right_two,val_up_two,2,width,"up");
                    dw2 = 2;            
                }
                else{
                    dw2 = 0;
                }
                break;

            case 40:
                if (!maze.isValid(canvas,step,"down",val_right_two,val_up_two)){
                    maze.destroyWall(canvas,step,val_right_two,val_up_two,2,width,"down");
                    dw2 = 2;
                }
                else{
                    dw2 = 0;
                }
                break;

            case 37:
                if (!maze.isValid(canvas,step,"left",val_right_two,val_up_two)){
                    maze.destroyWall(canvas,step,val_right_two,val_up_two,2,width,"left");
                    dw2 = 2;
                }
                else{
                    dw2 = 0;
                }
                break;

            case 39:
                if (!maze.isValid(canvas,step,"right",val_right_two,val_up_two)){
                    maze.destroyWall(canvas,step,val_right_two,val_up_two,2,width,"right");
                    dw2 = 2;
                }
                else{
                    dw2 = 0;
                }   
                break;     
        }
        
        
    }
}

};

    
window.onload = function () {
    
    canvas.setAttribute("width", "801");
    canvas.setAttribute("height", "801");

    seconds = 0;
    minutes = 0;
    connectionEstablished=0;
    var elem2 = document.getElementById('changeDifficultyButton');
        elem2.disabled = true;
        elem2.style.background = "#AAA";


    var mazeholder = document.getElementById("mazeHolder");
    
    if (mazeholder.insertAdjacentElement) {       
         mazeholder.insertAdjacentElement ("afterBegin", canvas);
    }
    
    else {
        switch ("afterBegin") {
            case "beforeBegin":
                mazeholder.parentNode.insertBefore (canvas, mazeholder);
                break;
            case "afterBegin":
                mazeholder.insertBefore (canvas, mazeholder.firstChild);
                 break;
            case "beforeEnd":
                mazeholder.appendChild (canvas);
                break;
            case "afterEnd":
                mazeholder.parentNode.insertBefore (canvas, mazeholder.nextSibling);
                break;
            }
        }

    socket = io();

    socket.on('SocketID message', function(data){
        socketID = data;
    });

    socket.on('Show Canvas', function(){
        changeTime();
        canvas.style.display="block";
        var elem = document.getElementById('getCodeButton');
        elem.disabled = true;
        elem.style.background = "#AAA";
        connectionEstablished = 1;
        var elem2 = document.getElementById('changeDifficultyButton');
        elem2.disabled = false;
        elem2.style.removeProperty('background');

    });

    socket.on('Change Matrix', function(data){
        if (data == 3){         // 3 => refresh button is pressed by opponent
            drawMaze(2);      // 2=> therefore only request for matrix
        }
        else{               // data == 1 => level changed by opponent
            changeDifficulty(2); // 2=> change your level and then request for matrix
        }
    });


    socket.on ('move blocks', function(msg){
        moveBlocks(msg.val, msg.player);
    });



   
    
    document.onkeydown = checkKey;

    function checkKey(e) {  
        e = e || window.event;
        e.preventDefault();
        moveBlocks(e.keyCode, 2);           //even (e.g 2) => move myself ; odd => move other player
        socket.emit('key code to server', {'keycode' : e.keyCode, 'clientID' : clientID});
    };
};











