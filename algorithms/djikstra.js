function djikstra(grid, startRow, startCol, colSize, rowSize){
    var pathArr = [];
    var visitedArr = [];
    var currentRow = startRow;
    var currentCol = startCol;
    var newGrid = grid.slice();
    for(var i = 0; i < rowSize; i++){
        for(var j = 0; j < colSize; j++){
            newGrid[i][j].distance = Number.MAX_SAFE_INTEGER;
        }
    }
    newGrid[startRow][startCol].distance = 0;
    var dirs = [[0,1],[1,0],[-1,0],[0,-1]];
    var currentNode = newGrid[currentRow][currentCol];
    while(currentNode.isFinish != true){
        dirs.forEach(dir => {
            if(currentNode.row+dir[0] >= 0 && currentNode.col+dir[1] >= 0 && currentNode.row+dir[0] < rowSize && currentNode.col+dir[1] < colSize){
                var searchingNode = newGrid[currentNode.row+dir[0]][currentNode.col+dir[1]];
                if(searchingNode.distance > currentNode.distance+1){
                    newGrid[currentNode.row+dir[0]][currentNode.col+dir[1]].distance = currentNode.distance+1;
                    newGrid[currentNode.row+dir[0]][currentNode.col+dir[1]].previousNode = newGrid[currentNode.row][currentNode.col]
                }
            }
        });
        newGrid[currentNode.row][currentNode.col].visited = true;
        visitedArr.unshift(newGrid)
        var nextCurrent = {
            distance: Number.MAX_SAFE_INTEGER
        }
        for(let row = 0; row < rowSize; row++){
            for(let col = 0; col < colSize; col++){
                if(newGrid[row][col].distance < nextCurrent.distance && newGrid[row][col].visited == false){
                    nextCurrent = newGrid[row][col];
                }
            }
        }
        if(nextCurrent.distance == Number.MAX_SAFE_INTEGER){
            console.log("no other reachable nodes");
            return -1;
        }
        currentNode = nextCurrent;
        }
        while(currentNode.isStart != true){
        pathArr.unshift(currentNode);
        currentNode = currentNode.previousNode;
        }
    console.log("finished");
    var returnArr = [pathArr, visitedArr];
    return pathArr;
}

function createNode(row, col){
    var newNode = {
        row: row,
        col: col,
        isFinish: false,
        isStart: false,
        visited: false,
    }
    return newNode;
}
function createNodeFinish(row, col){
    var newNode = {
        row: row,
        col: col,
        isFinish: true,
        isStart: false,
        visited: false,
    }
    return newNode;
}
function createNodeStart(row, col){
    var newNode = {
        row: row,
        col: col,
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

var pathArr = djikstra(grid, 2, 2, 20,20);
for(let i = 0; i < pathArr.length; i++){
    console.log(pathArr[i]);
}