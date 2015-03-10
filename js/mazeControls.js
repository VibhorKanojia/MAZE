/* This script lets the user control various aspects of the maze being drawn. */
var maze = new Maze(100, 100);
var val_right = 0;
var val_up = 0;
window.onload = function () {
    var canvas = document.createElement("canvas"),
        context = canvas.getContext('2d'),
        gradient = context.createLinearGradient(0, 0, 601, 601);

    canvas.setAttribute("width", "801");
    canvas.setAttribute("height", "801");

    document.getElementById("mazeHolder").insertAdjacentElement("afterBegin",
                                                                canvas);
    gradient.addColorStop(0, "#000044");
    gradient.addColorStop(0.8, "#3366FF");

    function drawMaze(width, height) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, 601, 601);
        maze = new Maze(width, height);
        var step = 600 / Math.max(width, height);
        maze.draw(canvas, step, {wall : gradient, background : "#FFBB88"});
    }

    drawMaze(30, 30);
    
    // Controls:
    var widthInput = document.getElementById("width"),
        heightInput = document.getElementById("height"),
        drawButton = document.getElementById("draw"),
        solveButton = document.getElementById("solve");

    drawButton.onclick = function () {
        drawMaze(widthInput.value, heightInput.value);
    };

    solveButton.onclick = function () {
        maze.drawSolution(canvas);
    };

    document.onkeydown = checkKey;

    function checkKey(e) {
        
        e = e || window.event;
        var step = 20;
        if (e.keyCode == '38') {
           if (maze.isValid(canvas,step,"up",val_right,val_up)){
                maze.removeCircle(canvas,step,val_right,val_up);
                val_up -=1;
                maze.drawCircle(canvas, step,val_right,val_up);
            }
        }
        else if (e.keyCode == '40') {
            //window.alert("down");
            if (maze.isValid(canvas,step,"down",val_right,val_up)){
                maze.removeCircle(canvas,step,val_right,val_up);
                val_up +=1;
                maze.drawCircle(canvas, step,val_right,val_up);
            }
        }
        else if (e.keyCode == '37') {
            //window.alert("left");
            if (maze.isValid(canvas,step,"left",val_right,val_up)){
                maze.removeCircle(canvas,step,val_right,val_up);
                val_right -=1;
                maze.drawCircle(canvas, step,val_right,val_up);
            }
        }
        else if (e.keyCode == '39') {
            //window.alert("right");
            if (maze.isValid(canvas,step,"right",val_right,val_up)){
                maze.removeCircle(canvas,step,val_right,val_up);
                val_right +=1;
                maze.drawCircle(canvas, step,val_right,val_up);
            }
        }

    };
};