export function dijkstra(grid, startRow, startCol, colSize, rowSize) {
    //init all vars
    var coinsCollected = 0;
    var coinCount = 0;
    var pathArr = [];
    var pathArr2 = [];
    var visitedArr = [];
    var currentRow = startRow;
    var currentCol = startCol;
    var foundCoinIndex = -1;
    var foundCoinIndexPath = -1;
    //create a copy of the original grid
    var newGrid = JSON.parse(JSON.stringify(grid));
    //set the distance of all of the nodes to the max value
    for (var i = 0; i < rowSize; i++) {
        for (var j = 0; j < colSize; j++) {
            newGrid[i][j].distance = Number.MAX_SAFE_INTEGER;
            if (newGrid[i][j].coin == true) {
                coinCount++;
            }
        }
    }
    //set the distance of the start node to zero
    newGrid[startRow][startCol].distance = 0;
    //define the directions for nearby nodes
    // (-1,-1) (-1, 0) (1, 1)
    // (-1, 0) (0, 0)  (1, 0)
    // (-1, 1) (1, 0)  (1, 1)
    //doesn't check the diagonals
    var dirs = [
        [0, 1],
        [1, 0],
        [-1, 0],
        [0, -1],
    ];
    //currentNode = start node
    var currentNode = newGrid[currentRow][currentCol];
    //if there are still coins to collect, run again
    while (coinsCollected != coinCount) {
        //if you found a coin
        if (currentNode.coin == true) {
            coinsCollected++;
            startCol = currentNode.col;
            startRow = currentNode.row;
            currentNode = newGrid[startRow][startCol];
            newGrid[startRow][startCol].coin = false;
            continue;
        }
        //for each of the adjacent nodes
        dirs.forEach((dir) => {
            if (currentNode.row + dir[0] >= 0 && currentNode.col + dir[1] >= 0 && currentNode.row + dir[0] < rowSize && currentNode.col + dir[1] < colSize) {
                var searchingNode = newGrid[currentNode.row + dir[0]][currentNode.col + dir[1]];
                if (searchingNode.distance > currentNode.distance + 1) {
                    //if this is the new min distance, set the distance to the node
                    //to the current node distance + 1
                    newGrid[currentNode.row + dir[0]][currentNode.col + dir[1]].distance = currentNode.distance + 1;
                    newGrid[currentNode.row + dir[0]][currentNode.col + dir[1]].previousNode = newGrid[currentNode.row][currentNode.col];
                }
            }
        });
        //current node is now visited
        newGrid[currentNode.row][currentNode.col].visited = true;
        //add to visited arr (for displaying)
        visitedArr.push(newGrid[currentNode.row][currentNode.col]);
        //arbitrary var set to have a distance of infinity
        //if this gets set to current node, there are no more reachable nodes
        var nextCurrent = {
            distance: Number.MAX_SAFE_INTEGER,
        };
        //find the node with the shortest distance
        for (let row = 0; row < rowSize; row++) {
            for (let col = 0; col < colSize; col++) {
                if (newGrid[row][col].distance < nextCurrent.distance && newGrid[row][col].visited == false && newGrid[row][col].wall == false) {
                    nextCurrent = newGrid[row][col];
                }
            }
        }
        //if distance = infinity, there are no more reachable nodes
        if (nextCurrent.distance == Number.MAX_SAFE_INTEGER) {
            console.log("no other reachable nodes");
            var returnArr = [-1, visitedArr];
            return returnArr;
        }
        // newGrid[currentNode.row][currentNode.col].visited = true;
        currentNode = nextCurrent;
    }
    //add to visitedArr
    visitedArr.push(newGrid[currentNode.row][currentNode.col]);

    //tracks when the coin was found, allows for easier display of searched nodes
    foundCoinIndex = visitedArr.length;
    //creates the pathArr by traversing the previous nodes
    while (currentNode != null) {
        if(currentNode.row != startRow || currentNode.col != startCol){
            pathArr.unshift(currentNode);
            currentNode = currentNode.previousNode;
        }else{
            currentNode = currentNode.previousNode;
        }
    }
    //tracks when the coin was found in the pathArr,
    //allows for easier display when paths overlap
    foundCoinIndexPath = pathArr.length;

    //duplicates the grid again
    var newGrid = JSON.parse(JSON.stringify(grid));
    //sets the distance to max
    for (var i = 0; i < rowSize; i++) {
        for (var j = 0; j < colSize; j++) {
            newGrid[i][j].distance = Number.MAX_SAFE_INTEGER;
        }
    }
    //start distance = 0
    newGrid[startRow][startCol].distance = 0;
    var currentNode = newGrid[startRow][startCol];
    //same functionality as the above while loop, but without coins
    while (currentNode.isFinish != true) {
        dirs.forEach((dir) => {
            if (currentNode.row + dir[0] >= 0 && currentNode.col + dir[1] >= 0 && currentNode.row + dir[0] < rowSize && currentNode.col + dir[1] < colSize) {
                var searchingNode = newGrid[currentNode.row + dir[0]][currentNode.col + dir[1]];
                if (searchingNode.distance > currentNode.distance + 1) {
                    //if the new distance is the min, set the dist
                    //of the node to distance of prev + 1
                    newGrid[currentNode.row + dir[0]][currentNode.col + dir[1]].distance = currentNode.distance + 1;
                    newGrid[currentNode.row + dir[0]][currentNode.col + dir[1]].previousNode = newGrid[currentNode.row][currentNode.col];
                }
            }
        });
        //set node to visited
        newGrid[currentNode.row][currentNode.col].visited = true;
        visitedArr.push(newGrid[currentNode.row][currentNode.col]);
        var nextCurrent = {
            distance: Number.MAX_SAFE_INTEGER,
        };
        // find the next node (shortest distance)
        for (let row = 0; row < rowSize; row++) {
            for (let col = 0; col < colSize; col++) {
                if (newGrid[row][col].distance < nextCurrent.distance && newGrid[row][col].visited == false && newGrid[row][col].wall == false) {
                    nextCurrent = newGrid[row][col];
                }
            }
        }
        //no distance less than max, no other reachable nodes
        if (nextCurrent.distance == Number.MAX_SAFE_INTEGER) {
            console.log("no other reachable nodes");
            var returnArr = [-1, visitedArr];
            return returnArr;
        }
        newGrid[currentNode.row][currentNode.col].visited = true;
        currentNode = nextCurrent;
    }
    //add to visited array and path array
    visitedArr.push(newGrid[currentNode.row][currentNode.col]);
    while (currentNode != null) {
        pathArr2.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    //return an array with all the information needed to display the nodes
    pathArr.push.apply(pathArr, pathArr2);
    var returnArr = [pathArr, visitedArr, foundCoinIndex, foundCoinIndexPath];
    return returnArr;
}
