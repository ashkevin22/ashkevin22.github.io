function djikstra(grid, startRow, startCol, colSize, rowSize){
    var pathArr = [];
    currentRow = startRow;
    currentCol = startCol;
    newGrid = grid.slice();
    for(var i = 0; i < rowSize; i++){
        for(var j = 0; j < colSize; j++){
            newGrid[i][j].distance = Number.MAX_SAFE_INTEGER;
        }
    }
    newGrid[startRow][startCol].distance = 0;
    dirs = [[0,1],[1,0],[-1,0],[0,-1]];
    currentNode = newGrid[currentRow][currentCol];
    while(currentNode.isFinish != true){
        dirs.forEach(dir => {
            searchingNode = newGrid[currentRow+dir[0]][currentCol+dir[1]];
            if(searchingNode != null){
                if(searchingNode.distance > currentNode.distance+1){
                    newGrid[currentRow+dir[0]][currentCol+dir[1]].distance = currentNode.distance+1;
                }
            }
            console.log(newGrid[currentRow+dir[0]][currentCol+dir[1]]);
        });
        // console.log(currentNode);
        // console.log(currentNode.row);
        // console.log(currentNode.col);
        // console.log(newGrid[currentNode.row][currentNode.col]);
        newGrid[currentNode.row][currentNode.col].visited = true;
        nextCurrent = {
            distance: Number.MAX_SAFE_INTEGER
        }
        for(let row = 0; row < rowSize; row++){
            for(let col = 0; col < colSize; col++){
                nextCurrent.distance = Number.MAX_SAFE_INTEGER;
                if(newGrid[row][col].distance < nextCurrent.distance && newGrid[row][col].visited == false){
                    nextCurrent = newGrid[row][col];
                }
            }
        }
        if(nextCurrent == Number.MAX_SAFE_INTEGER){
            console.log("no other reachable nodes");
            return -1;
        }
        currentNode = nextCurrent;
    }
    return;
}

function createNode(row, col){
    var newNode = {
        col: col,
        row: row,
        isFinish: false,
        isStart: false,
        visited: false,
    }
    return newNode;
}
function createNodeFinish(row, col){
    var newNode = {
        col: col,
        row: row,
        isFinish: true,
        isStart: false,
        visited: false,
    }
    return newNode;
}
function createNodeStart(row, col){
    var newNode = {
        col: col,
        row: row,
        isFinish: false,
        isStart: true,
        visited: false,
    }
    return newNode;
}


var grid = [];
for(let row = 0; row < 20; row++){
    var currentRow = [];
    for(let col = 0; col < 20; col++){
        currentRow.push(createNode(row,col));
    }
    grid.push(currentRow);
}

grid[2][2] = createNodeStart(2,2);
grid[10][10] = createNodeFinish(10,10);

djikstra(grid, 2, 2, 20,20);