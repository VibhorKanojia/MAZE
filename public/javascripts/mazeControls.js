/* This script lets the user control various aspects of the maze being drawn. */

var clientID;
var socketID;
var socket;
  

function getDATA(){
    window.alert(clientID + " " + socketID);
}

var clobject = {'cells':[]};

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

function drawMaze() {
    
    dw1 = 0;                //destroy wall player 1
    dw2 = 0;                //destroy wall player 2

    val_right_one = 0;
    val_up_one = 0;
    val_right_two = 0;
    val_up_two = 0;

    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas_width, canvas_height);
    maze = new Maze(width, height); 

    if (clientID % 2 ==  0){
        window.alert(clientID);
        clobject.cells = maze.draw(canvas, step);
        socket.emit('current matrix', clobject);
    }
    else {
        window.alert(clientID);
        socket.on('Use matrix', function (data){
            maze.draw(canvas,step,data);    
        });
        
    }

};




function solveMaze() {
        maze.drawSolution(canvas);
    };

function changeDifficulty() {
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
        drawMaze();
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
        drawMaze();
    });


    socket.on ('move blocks', function(msg){
        moveBlocks(msg);
    });


function moveBlocks(val){

    if (!(dw1 == 1)){

        switch(val){

            case 38:            
                if (maze.isValid(canvas,step,"up",val_right_one,val_up_one)){
                    maze.removeCircle(canvas,step,val_right_one,val_up_one);
                    val_up_one -=1;        
                }
                break;

            case 40:           
                if (maze.isValid(canvas,step,"down",val_right_one,val_up_one)){
                    maze.removeCircle(canvas,step,val_right_one,val_up_one);
                    val_up_one +=1;
                }
                break;

            case 37:    
                if (maze.isValid(canvas,step,"left",val_right_one,val_up_one)){
                    maze.removeCircle(canvas,step,val_right_one,val_up_one);
                    val_right_one -=1;
                }
                break;

            case 39:
                if (maze.isValid(canvas,step,"right",val_right_one,val_up_one)){
                    maze.removeCircle(canvas,step,val_right_one,val_up_one);
                    val_right_one +=1;
                }
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

    if (!(dw2==1)){

        switch(val){

            case 87:
                if (maze.isValid(canvas,step,"up",val_right_two,val_up_two)){
                    maze.removeCircle(canvas,step,val_right_two,val_up_two);
                    val_up_two -=1;
                }    
                break;

            case 83:
                if (maze.isValid(canvas,step,"down",val_right_two,val_up_two)){
                    maze.removeCircle(canvas,step,val_right_two,val_up_two);
                    val_up_two +=1;
                }
                break;

            case 65:
                if (maze.isValid(canvas,step,"left",val_right_two,val_up_two)){
                    maze.removeCircle(canvas,step,val_right_two,val_up_two);
                    val_right_two -=1;
                }
                break;

            case 68:
                if (maze.isValid(canvas,step,"right",val_right_two,val_up_two)){
                    maze.removeCircle(canvas,step,val_right_two,val_up_two);
                    val_right_two +=1;
                }  
                break;  
        }

        maze.drawCircle(canvas, step,val_right_two,val_up_two,2,width);
        maze.drawCircle(canvas, step,val_right_one,val_up_one,1,width);
    }
        
    else {

        switch(val){
            case 87:
                maze.destroyWall(canvas,step,val_right_two,val_up_two,2,width,"up");
                break;

            case 83:
                maze.destroyWall(canvas,step,val_right_two,val_up_two,2,width,"down");
                break;

            case 65:
                maze.destroyWall(canvas,step,val_right_two,val_up_two,2,width,"left");
                break;

            case 68:
                maze.destroyWall(canvas,step,val_right_two,val_up_two,2,width,"right");
                break;        
        }
        
        dw2 = 2;
    }

    if (val == '191'){
        dw1++;
        
    }

    else if (val == '70'){
        dw2++;
    }

};



    
    
    document.onkeydown = checkKey;

    function checkKey(e) {  
        e = e || window.event;
        socket.emit('key code to server', {'keycode' : e.keyCode, 'clientID' : clientID});
    };
};











