/* This script lets the user control various aspects of the maze being drawn. */

var clientID;
var socketID;
var socket;
  

function getDATA(){
    window.alert(clientID + " " + socketID);
}

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

function drawMaze(diff_flag) {
    
    dw1 = 0;                //destroy wall player 1
    dw2 = 0;                //destroy wall player 2

    val_right_one = 0;                                                  //FUCKING COMPLICATED STUFF AHEAD
    val_up_one = 0;
    val_right_two = 0;
    val_up_two = 0;

    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas_width, canvas_height);
    maze = new Maze(width, height); 

    if (clientID % 2 ==  0){
        clobject.cells = maze.draw(canvas, step);
        
        if (diff_flag == 0) {           //DIFF FLAG = 0 => first client starting the game for the first time or refresh button pressed
            var noID = -1;
            socket.emit('current matrix', {'matrix' : clobject, 'senderID' : noID, 'diff_flag' : diff_flag});
        }
        else if (diff_flag == 1 || diff_flag == 3){ //DIFF FLAG = 1 => difficulty changed ; DIFF_FLAG =3 => refresh button pressed
            socket.emit('current matrix', {'matrix' : clobject, 'senderID' : clientID, 'diff_flag' : diff_flag});    
        }
        else if (diff_flag == 2){   // DIFF_FLAG = 2 => difficulty changed or refresh button pressed by opponent
            socket.emit('Request Maze', clientID);
            socket.on('Use matrix', function (data){
                maze.draw(canvas,step,data);    
            });
        }
        
    }
    else {
        
        if (diff_flag == 0) {   //DIFF_FLAG = 0 => second client connecting for the first time or refresh button button pressed by opponent or difficulty changed by opponent.
            socket.emit('Request Maze', clientID);
            socket.on('Use matrix', function (data){
                maze.draw(canvas,step,data);    
            });
        }

        else if (diff_flag == 1 || diff_flag == 3){ // 1 => difficulty changed by player ; 3 => refresh button pressed by player
            clobject.cells = maze.draw(canvas, step);
            socket.emit('current matrix', {'matrix' : clobject, 'senderID' : clientID, 'diff_flag' : diff_flag});    
        }        
    }

};




function solveMaze() {
        maze.drawSolution(canvas);
    };

function changeDifficulty(flag) {
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
    
window.onload = function () {
    
 
    canvas.setAttribute("width", "801");
    canvas.setAttribute("height", "801");

    
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

    socket.on('Client ID message', function(data){
    
        clientID = data.clientID;
        socketID = data.socketID;
        // drawMaze(0); // RELOAD BUTTON IS PRESSED TO START A GAME
    });



    socket.on('Change Difficulty', function(data){
        if (clientID % 2 == 0){
            if (data == 3){
                drawMaze(2);
            }
            else{
                changeDifficulty(2);
            }
        }
        else {
            if (data == 3){
                drawMaze(0);
            }
            else{
                changeDifficulty(0);
            }
        }
    });


    socket.on ('move blocks', function(msg){
        moveBlocks(msg.val, msg.player);
    });


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
                maze.destroyWall(canvas,step,val_right_one,val_up_one,1,width,"up");
                break;

            case 40:
                maze.destroyWall(canvas,step,val_right_one,val_up_one,1,width,"down");
                break;

            case 37:
                maze.destroyWall(canvas,step,val_right_one,val_up_one,1,width,"left");
                break;

            case 39:
                maze.destroyWall(canvas,step,val_right_one,val_up_one,1,width,"right");
                break;                
        }

        dw1 = 2;
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
                maze.destroyWall(canvas,step,val_right_two,val_up_two,2,width,"up");
                break;

            case 40:
                maze.destroyWall(canvas,step,val_right_two,val_up_two,2,width,"down");
                break;

            case 37:
                maze.destroyWall(canvas,step,val_right_two,val_up_two,2,width,"left");
                break;

            case 39:
                maze.destroyWall(canvas,step,val_right_two,val_up_two,2,width,"right");
                break;        
        }
        
        dw2 = 2;
    }
}

};

   
    
    document.onkeydown = checkKey;

    function checkKey(e) {  
        e = e || window.event;
        e.preventDefault();
        moveBlocks(e.keyCode, 2);
        socket.emit('key code to server', {'keycode' : e.keyCode, 'clientID' : clientID});
    };
};











