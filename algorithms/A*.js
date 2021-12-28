export function Astar(grid, startRow, startCol, colSize, rowSize, finishRow, finishCol) {
    //init all variables
    var openList = [];
    var closedList = [];
    var visitedArr = [];
    var returnArr = [];
    var pathArr = [];
    var pathArr2 = [];
    var coinRow = -1;
    var coinCol = -1;
    var addToOpen;
    var foundCoinIndex = -1;
    var foundCoinIndexPath = -1;
    var boolCoin = false;
    var boolFoundCoin = false;

    //create a copy of the array so we're not modifying the original
    var newGrid = JSON.parse(JSON.stringify(grid));
    var currentNode;
    //set the f value for every node to infinity
    
    for (var i = 0; i < rowSize; i++) {
        for (var j = 0; j < colSize; j++) {
            if(newGrid[i][j].coin){
                boolCoin = true;
                coinRow = i;
                coinCol = j;
            }
            newGrid[i][j].f = Number.MAX_SAFE_INTEGER;
        }
    }


    if(boolCoin){
        //set all values for the starting node to 0
        newGrid[startRow][startCol].g = 0;
        newGrid[startRow][startCol].f = 0;
        newGrid[startRow][startCol].h = 0;
        newGrid[startRow][startCol].previousNode = null;
        openList.push(newGrid[startRow][startCol]);
        visitedArr.push(newGrid[startRow][startCol]);
        var dirs = [
            [0, 1],
            [1, 0],
            [-1, 0],
            [0, -1],
        ];
        //while there are still nodes on the open list, check them
        while (openList.length != 0) {
            currentNode = {
                f: Number.MAX_SAFE_INTEGER,
            };
            //find the node in the open list with the lowest f value
            for (var i = 0; i < openList.length; i++) {
                if (openList[i].f < currentNode.f) {
                    currentNode = openList[i];
                }
            }

            //if node is the coin node, we can return
            if (currentNode.coin) {
                visitedArr.push(newGrid[currentNode.row][currentNode.col]);
                startRow = currentNode.row;
                startCol = currentNode.col;
                foundCoinIndex = visitedArr.length;
                while (currentNode != null) {
                    pathArr2.unshift(currentNode);
                    currentNode = currentNode.previousNode;
                }
                foundCoinIndexPath = pathArr2.length
                boolFoundCoin = true;
                break;
            }

            visitedArr.push(newGrid[currentNode.row][currentNode.col]);
            //remove the current node from the open list
            const index = openList.indexOf(currentNode);
            openList.splice(index, 1);
            //push the current node to the closed list
            closedList.push(newGrid[currentNode.row][currentNode.col]);

            //generate the successor nodes and set their previousNode to currentNode
            dirs.forEach((dir) => {
                var rowVal = currentNode.row + dir[0];
                var colVal = currentNode.col + dir[1];

                //checking if direction is in-bounds
                if (rowVal >= 0 && colVal >= 0 && rowVal < rowSize && colVal < colSize && newGrid[rowVal][colVal].wall != true) {
                    newGrid[rowVal][colVal].g = currentNode.g + 1;
                    //using the manhattan heuristic to get the h value
                    newGrid[rowVal][colVal].h = 1.01 * Math.abs(rowVal - coinRow) + Math.abs(colVal - coinCol);
                    //calculates the f value based on the h and g values
                    newGrid[rowVal][colVal].f = newGrid[rowVal][colVal].g + newGrid[rowVal][colVal].h;
                    addToOpen = true;
                    //checking if current position is already in open list, if it is and has a lower
                    //f value than the searching node, do not add the searching node to the open list
                    for (var i = 0; i < openList.length; i++) {
                        if (openList[i].row == rowVal && openList[i].col == colVal) {
                            if (openList[i].f >= newGrid[rowVal][colVal].f) {
                                addToOpen = false;
                            }
                        }
                    }
                    // same thing as above but for the closed list
                    for (var i = 0; i < closedList.length; i++) {
                        if (closedList[i].row == rowVal && closedList[i].col == colVal) {
                            if (closedList[i].f >= newGrid[rowVal][colVal].f) {
                                addToOpen = false;
                            }
                        }
                    }

                    //if the current node is not in closed and open lists or has the smallest
                    //f value out of other routes to that node, add to openList
                    if (addToOpen) {
                        newGrid[rowVal][colVal].previousNode = currentNode;
                        openList.push(newGrid[rowVal][colVal]);
                    }
                }
            });
        }
        //if there are no more open nodes and the finish node was not found,
        //it is impossible to reach the finish
        if(!boolFoundCoin){
            console.log("no remaining nodes");
            returnArr = [-1, visitedArr, -1, -1];
            return returnArr;
        }

    }

    openList = [];
    closedList = [];

    for (var i = 0; i < rowSize; i++) {
        for (var j = 0; j < colSize; j++) {
            newGrid[i][j].f = Number.MAX_SAFE_INTEGER;
        }
    }

    //set all values for the starting node to 0
    newGrid[startRow][startCol].g = 0;
    newGrid[startRow][startCol].f = 0;
    newGrid[startRow][startCol].h = 0;
    //start node has no previous node
    newGrid[startRow][startCol].previousNode = null;
    //push the start node onto the openlist array
    openList.push(newGrid[startRow][startCol]);
    //push the start node onto the visitiedArr
    //visitedArr is used for displaying the visited nodes
    visitedArr.push(newGrid[startRow][startCol]);
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
    //while there are still nodes on the open list, check them
    while (openList.length != 0) {
        currentNode = {
            f: Number.MAX_SAFE_INTEGER,
        };
        //find the node in the open list with the lowest f value
        for (var i = 0; i < openList.length; i++) {
            if (openList[i].f < currentNode.f) {
                currentNode = openList[i];
            }
        }

        //if node is the finish node, we can return
        if (currentNode.finish) {
            visitedArr.push(newGrid[currentNode.row][currentNode.col]);
            while (currentNode != null) {
                pathArr.unshift(currentNode);
                currentNode = currentNode.previousNode;
            }
            pathArr2.push.apply(pathArr2, pathArr);
            returnArr = [pathArr2, visitedArr, foundCoinIndex, foundCoinIndexPath];
            return returnArr;
        }

        visitedArr.push(newGrid[currentNode.row][currentNode.col]);
        //remove the current node from the open list
        const index = openList.indexOf(currentNode);
        openList.splice(index, 1);
        //push the current node to the closed list
        closedList.push(newGrid[currentNode.row][currentNode.col]);

        //generate the successor nodes and set their previousNode to currentNode
        dirs.forEach((dir) => {
            var rowVal = currentNode.row + dir[0];
            var colVal = currentNode.col + dir[1];

            //checking if direction is in-bounds
            if (rowVal >= 0 && colVal >= 0 && rowVal < rowSize && colVal < colSize && newGrid[rowVal][colVal].wall != true) {
                newGrid[rowVal][colVal].g = currentNode.g + 1;
                //using the manhattan heuristic to get the h value
                newGrid[rowVal][colVal].h = 1.01* Math.abs(rowVal - finishRow) + Math.abs(colVal - finishCol);
                //calculates the f value based on the h and g values
                newGrid[rowVal][colVal].f = newGrid[rowVal][colVal].g + newGrid[rowVal][colVal].h;
                addToOpen = true;
                //checking if current position is already in open list, if it is and has a lower
                //f value than the searching node, do not add the searching node to the open list
                for (var i = 0; i < openList.length; i++) {
                    if (openList[i].row == rowVal && openList[i].col == colVal) {
                        if (openList[i].f >= newGrid[rowVal][colVal].f) {
                            addToOpen = false;
                        }
                    }
                }
                // same thing as above but for the closed list
                for (var i = 0; i < closedList.length; i++) {
                    if (closedList[i].row == rowVal && closedList[i].col == colVal) {
                        if (closedList[i].f >= newGrid[rowVal][colVal].f) {
                            addToOpen = false;
                        }
                    }
                }

                //if the current node is not in closed and open lists or has the smallest
                //f value out of other routes to that node, add to openList
                if (addToOpen) {
                    newGrid[rowVal][colVal].previousNode = currentNode;
                    openList.push(newGrid[rowVal][colVal]);
                }
            }
        });
    }
    //if there are no more open nodes and the finish node was not found,
    //it is impossible to reach the finish
    console.log("no remaining nodes");
    returnArr = [-1, visitedArr, -1, -1];
    return returnArr;
}
