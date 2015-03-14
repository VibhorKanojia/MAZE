/* This script lets the user control various aspects of the maze being drawn. */

var difficulty = 1;
var canvas_width = 601;
var canvas_height = 601;
var width = 30;
var height = 30;

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
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, canvas_width, canvas_height);
        maze = new Maze(width, height); 
        maze.draw(canvas, step);
    }

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
   // var canvas = document.createElement("canvas"),
    //    context = canvas.getContext('2d'),
     //   gradient = context.createLinearGradient(0, 0, 601, 601,width);

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

    
    drawMaze();
    document.onkeydown = checkKey;

    function checkKey(e) {
        
        e = e || window.event;
        var step = (canvas_width-1)/width;
        if (e.keyCode == '38') {
           if (maze.isValid(canvas,step,"up",val_right_one,val_up_one)){
                maze.removeCircle(canvas,step,val_right_one,val_up_one);
                val_up_one -=1;
                maze.drawCircle(canvas, step,val_right_one,val_up_one,1,width);
                maze.drawCircle(canvas, step,val_right_two,val_up_two,2,width);


            }
        }
        else if (e.keyCode == '40') {
            //window.alert("down");
            if (maze.isValid(canvas,step,"down",val_right_one,val_up_one)){
                maze.removeCircle(canvas,step,val_right_one,val_up_one);
                val_up_one +=1;
                maze.drawCircle(canvas, step,val_right_one,val_up_one,1,width);
                maze.drawCircle(canvas, step,val_right_two,val_up_two,2,width);

            }
        }
        else if (e.keyCode == '37') {
            //window.alert("left");
            if (maze.isValid(canvas,step,"left",val_right_one,val_up_one)){
                maze.removeCircle(canvas,step,val_right_one,val_up_one);
                val_right_one -=1;
                maze.drawCircle(canvas, step,val_right_one,val_up_one,1,width);
                maze.drawCircle(canvas, step,val_right_two,val_up_two,2,width);

            }
        }
        else if (e.keyCode == '39') {
            //window.alert("right");
            if (maze.isValid(canvas,step,"right",val_right_one,val_up_one)){
                maze.removeCircle(canvas,step,val_right_one,val_up_one);
                val_right_one +=1;
                maze.drawCircle(canvas, step,val_right_one,val_up_one,1,width);
                maze.drawCircle(canvas, step,val_right_two,val_up_two,2,width);

            }
        }

        else if (e.keyCode == '87') {               //W
            //window.alert("right");
            if (maze.isValid(canvas,step,"up",val_right_two,val_up_two)){
                maze.removeCircle(canvas,step,val_right_two,val_up_two);
                val_up_two -=1;
                maze.drawCircle(canvas, step,val_right_two,val_up_two,2,width);
                maze.drawCircle(canvas, step,val_right_one,val_up_one,1,width);

            }
        }

        else if (e.keyCode == '83') {               //S
            //window.alert("down");
            if (maze.isValid(canvas,step,"down",val_right_two,val_up_two)){
                maze.removeCircle(canvas,step,val_right_two,val_up_two);
                val_up_two +=1;
                maze.drawCircle(canvas, step,val_right_two,val_up_two,2,width);
                maze.drawCircle(canvas, step,val_right_one,val_up_one,1,width);
            }
        }

        else if (e.keyCode == '65') {    //A
            //window.alert("left");
            if (maze.isValid(canvas,step,"left",val_right_two,val_up_two)){
                maze.removeCircle(canvas,step,val_right_two,val_up_two);
                val_right_two -=1;
                maze.drawCircle(canvas, step,val_right_two,val_up_two,2,width);
                maze.drawCircle(canvas, step,val_right_one,val_up_one,1,width);
            }
        }


        else if (e.keyCode == '68') {               //D
            //window.alert("right");
            if (maze.isValid(canvas,step,"right",val_right_two,val_up_two)){
                maze.removeCircle(canvas,step,val_right_two,val_up_two);
                val_right_two +=1;
                maze.drawCircle(canvas, step,val_right_two,val_up_two,2,width);
                maze.drawCircle(canvas, step,val_right_one,val_up_one,1,width);
            }
        }


    };
};