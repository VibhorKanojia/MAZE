
var endFlag = 0;

function Maze(width, height) {
    endFlag = 0;
    var cells = [],
        visited = 0, // The number of cells already visited.
        solution = []; // The solution to the maze.
    
    for (var x = 0; x < width; x++) {
        cells[x] = [];
        for (var y = 0; y < height; y++) {
            cells[x][y] = new Cell(x, y);
        }
    }

    /* Gets all of the cells we can possibly go to next. If the second argument
     * is true, this takes walls into account when finding options, returning
     * only the options with no walls between them and the cell.
     */
    function getOptions(cell, walls) {
        var options = [];
        
        /* If the given coordinates are an option, pushes the corresponding 
         * cell onto the options array.
         */
        function checkOption(x, y) {
            if (walls) {
                if ((y < cell.y && cell.walls.n) ||
                    (x > cell.x && cell.walls.e) ||
                    (y > cell.y && cell.walls.s) ||
                    (x < cell.x && cell.walls.w)) {
                    return;
                }
            }   
                        
            if (cells[x] && cells[x][y] && !cells[x][y].visited) {
                options.push(cells[x][y]);
            }
        }

        checkOption(cell.x, cell.y - 1);
        checkOption(cell.x + 1, cell.y); 
        checkOption(cell.x, cell.y + 1); 
        checkOption(cell.x - 1, cell.y);

        return options;
    }
    
    /* Visits each unvisited cell, starting with the given one, randomly
     * traveling to adjacent cells and knocking out the walls between them to
     * create the maze.
     */
    function visit(cell, direction) {
        cell.visited = true;
        if (direction) {
            cell.walls[direction] = false;
        }

        //Get the possible options for going forward:
        var options = getOptions(cell);

        while (options.length > 0) {
            // The next cell is chosen randomly from the possible options
            var index = Math.floor(Math.random() * options.length);
            var nextCell = options[index];
            
            if (cell.y > nextCell.y) {
                cell.walls.n = false;
                visit(nextCell, "s");
            } else if (cell.x < nextCell.x) {
                cell.walls.e = false;
                visit(nextCell, "w");
            } else if (cell.y < nextCell.y) {
                cell.walls.s = false;
                visit(nextCell, "n");
            } else if (cell. x > nextCell.x) {
                cell.walls.w = false;
                visit(nextCell, "e");
            }

            options = getOptions(cell);
        }
    }

    var startX = Math.floor(Math.random() * width),
        startY = Math.floor(Math.random() * height);
    visit(cells[startX][startY]); // starting cell



    /* Returns an array of cells that are a path from the cell specified in the
     * first two coordinates to the cell specified in the last two coordinates.
     */
    this.solve = function (startX, startY, endX, endY) {
        startX = startX || 0;
        startY = startY || 0;
        endX = typeof endX == "undefined" ? width - 1 : endX;
        endY = typeof endY == "undefined" ? height - 1 : endY;
        
        // Mark all cells as unvisited:
        for (var x = 0; x < cells.length; x++) {
            for (var y = 0; y < cells[x].length; y++) {
                cells[x][y].visited = false;
            }
        }

        var solution = [],
            cell = cells[startX][startY],
            options = [];

        while ((cell.x != endX) || (cell.y != endY)) {
            cell.visited = true;
            options = getOptions(cell, true);

            if (options.length == 0) {
                cell = solution.pop();
            } else {
                solution.push(cell);
                cell = options[0];
            }
        }

        solution.push(cell);

        return solution;
    };
    
    /* A cell in the maze. This cell has some number of walls. */
    function Cell(x, y) {
        // The location of the cell:
        this.x = x;
        this.y = y;
        
        // The walls of this cell.
        this.walls = {
            n : true,
            e : true,
            s : true,
            w : true
        };

        // Have we gone through this cell yet?
        this.visited = false;
    }    

    /* Draws the maze on the given canvas (or canvas with the given id). The
     * step size determines how tall each cell is. You can pass in an object to
     * control various colors in the maze; this object can contain fields for
     * the wall color, the background color, the start color and the end color.
     * Each field should be named for the first word of what it controls
     * ("wall", "start" and so on). These colors are actually styles, so they
     * can be gradients or patterns as well.
     */


    this.draw = function (canvas, step, ref_obj) {
        if (typeof canvas == "string") {
            canvas = document.getElementById(canvas);
        }

        //window.alert((ref_obj.cells).length);
        if (ref_obj){
            //window.alert((ref_obj.cells).length);
            cells = (ref_obj.cells).slice();
        } 
        colors = {};
        colors.wall = "#09C";
        colors.background = "#FFFFFF";
        colors.start = colors.start || "#33FF66";
        colors.end = colors.end || "#FF6633";

        try {
	    var context = canvas.getContext('2d');
        } catch (e) {
	    //Canvas isn't supported...
	    return;
        }

        // Draw the background first:
        context.fillStyle = colors.background;
        context.fillRect(0, 0, width * step + 1, height * step + 1);

        // Sets the right color:
        context.fillStyle = colors.wall;

        /* Returns the actual position of the cell in pixels. */
        function actualPosition(cell) {
            return [cell.x * step, cell.y * step];
        }

        var actualX = 0,
            actualY = 0,
            cell;
        for (var x = 0; x < cells.length; x++) {
            for (var y = 0; y < cells[x].length; y++) {
                cell = cells[x][y];
                actualX = actualPosition(cell)[0];
                actualY = actualPosition(cell)[1];

                if (cell.walls.n) {
                    context.fillRect(actualX, actualY, step, 5);
                    //this.roundRect(context, actualX,actualY,5,step,true,false);

                }
                if (cell.walls.e) {
                    context.fillRect(actualX + step, actualY, 5, step);
                    //this.roundRect(context, actualX+step, actualY, step, 5,true,false);
                }
                if (cell.walls.s) {
                    context.fillRect(actualX, actualY + step, step, 5);
                  //  this.roundRect(context, actualX, actualY + step, 5, step,true,false);
                }
                if (cell.walls.w) {
                    context.fillRect(actualX, actualY, 5, step);
                   // this.roundRect(context, actualX, actualY, step, 5, true, false);

                }
            }
        }

        // Fill up start block with 1st player's color:
         context.fillStyle = '#20376D';
         context.fillRect(5, 5, step - 5, step - 5);
           
        //Fill up exit
        context.fillStyle = '#09C';
        context.fillRect((width - 1) * step + 5, (height - 1) * step + 5,
                         step , step );

        

        /* Draws the solution to the maze; does not draw the maze itself. The
         * specified color can also be a gradient or a pattern.
         */
        this.drawSolution = function (canvas, color) {
            if (typeof canvas == "string") {
                canvas = document.getElementById(canvas);
            }
            if (!color){
                color = "#ccf2ff";
            }

            try {
	        var context = canvas.getContext('2d');
            } catch (e) {
	        // We can't do anything if canvas isn't supported...
	        return;
            }

            // Now draw the solution:
            var solution = this.solve(0, 0, width - 1, height - 1);
            context.fillStyle = color;

            // Get rid of the start and end cells, we don't want to draw those:
            solution.pop();
            solution.shift();
            
            for (var i = 0; i < solution.length; i++) {
                var position = actualPosition(solution[i]);
                context.fillRect(position[0] + 5, position[1] + 5, step - 5,
                                 step - 5);
            }
        };


        this.isValid = function(canvas, step, direction, cell_x, cell_y){
            if (endFlag == 1) return false;
            if (direction == "up" && cells[cell_x][cell_y].walls.n){
                //window.alert("can't move up");
                return false;
            }
            else if (direction == "down" && cells[cell_x][cell_y].walls.s){
                //window.alert("can't move down");
                return false;
            }
            else if (direction == "right" && cells[cell_x][cell_y].walls.e){
                //window.alert("can't move right");
                return false;
            }
            else if (direction == "left" && cells[cell_x][cell_y].walls.w){
                //window.alert("can't move left");
                return false;
            }
            else{
                //window.alert("can move");
                return true;
            }
        }


        this.drawCircle = function (canvas, step, val_right,val_up, player,width){
            if (endFlag == 1) return;            

            if (typeof canvas == "string") {
             canvas = document.getElementById(canvas);
            }
        
            
            try {
                var context = canvas.getContext('2d');
            } catch (e) {
                window.alert("problem");
                return;
            }
            if (player == 1){
                context.fillStyle = '#20376D';
            }
            else if (player == 2){
                context.fillStyle = '#7F98D4';
            }
            
            //this.roundRect(context, 5+val_right*step, 5+val_up*step, step - 5, step - 5,true,false);
            context.fillRect(5+val_right*step, 5+val_up*step, step - 5, step - 5);

            if (val_right == width -1 && val_up == width -1){
                if (player == 1){
                    endFlag = 1;
                    window.alert("You Won");
                }

                else if (player == 2){
                    endFlag = 1;
                    window.alert("Better luck next time!");
                }   
            }
        };
                
        this.destroyWall = function (canvas, step, val_right, val_up, width, direction){
            if (typeof canvas == "string") {
             canvas = document.getElementById(canvas);
            }
            
            try {
                var context = canvas.getContext('2d');
            } catch (e) {
                window.alert("problem");
                return;
            }
            var cell = cells[val_right][val_up];
            if (direction == "up"){
                if (cells[val_right][val_up-1]){
                    cell.walls.n = false;
                    cells[val_right][val_up-1].walls.s = false;
                    context.fillStyle = 'white';
                    context.fillRect(cell.x*step, cell.y*step, step, 5);
                }

            }
            else if (direction == "down"){
                if (cells[val_right][val_up+1]){
                    cell.walls.s = false;
                    context.fillStyle = 'white';
                    cells[val_right][val_up+1].walls.n = false;
                    context.fillRect(cell.x*step, cell.y*step + step, step, 5);
                }

            }
            else if (direction == "left"){
                if (cells[val_right-1][val_up]){
                    cell.walls.w = false;
                    context.fillStyle = 'white';
                    cells[val_right-1][val_up].walls.e = false;
                    context.fillRect(cell.x*step, cell.y*step, 5, step);
                }

            }
            else if (direction == "right"){
                if (cells[val_right+1][val_up]){
                    cell.walls.e = false;
                    context.fillStyle = 'white';
                    cells[val_right+1][val_up].walls.w = false;
                    context.fillRect(cell.x*step+step, cell.y*step, 5, step);
                }

            }
        }

        this.removeCircle = function (canvas, step, val_right, val_up){             // removing the previous mark
            if (typeof canvas == "string") {
             canvas = document.getElementById(canvas);
            }
            
            try {
                var context = canvas.getContext('2d');
            } catch (e) {
                window.alert("problem");
                return;
            }
           
            context.fillStyle = 'white';
            context.fillRect(5+val_right*step, 5+val_up*step, step - 5, step - 5);
        };

        return cells;
    };
}