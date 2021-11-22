export function Astar(grid, startRow, startCol, colSize, rowSize, finishRow, finishCol) {
    var openList = [];
    var closedList = [];
    var visitedArr = [];
    var returnArr = [];
    var pathArr = [];
    var addToOpen;
    var newGrid = JSON.parse(JSON.stringify(grid));
    var currentNode;
    for (var i = 0; i < rowSize; i++) {
        for (var j = 0; j < colSize; j++) {
            newGrid[i][j].f = Number.MAX_SAFE_INTEGER;
        }
    }
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

        if (currentNode.isFinish) {
            // this is the finish node
            visitedArr.push(newGrid[currentNode.row][currentNode.col]);
            while (currentNode != null) {
                pathArr.unshift(currentNode);
                currentNode = currentNode.previousNode;
            }
            returnArr = [pathArr, visitedArr];
            return returnArr;
        }

        console.log(currentNode);

        visitedArr.push(newGrid[currentNode.row][currentNode.col]);
        //remove the found node from the open list
        const index = openList.indexOf(currentNode);
        openList.splice(index, 1);
        closedList.push(newGrid[currentNode.row][currentNode.col]);

        //generate the successor nodes and set their previousNode to currentNode
        dirs.forEach((dir) => {
            //checking if direction is in-bounds
            var rowVal = currentNode.row + dir[0];
            var colVal = currentNode.col + dir[1];

            if (rowVal >= 0 && colVal >= 0 && rowVal < rowSize && colVal < colSize && newGrid[rowVal][colVal].wall != true) {
                newGrid[rowVal][colVal].g = currentNode.g + 1;
                //using the manhattan heuristic to get the h value
                newGrid[rowVal][colVal].h = Math.abs(rowVal - finishRow) + Math.abs(colVal - finishCol);
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

                if (addToOpen) {
                    newGrid[rowVal][colVal].previousNode = currentNode;
                    openList.push(newGrid[rowVal][colVal]);
                }
            }
        });
    }
    console.log("no remaining nodes");
    returnArr = [-1, visitedArr];
    return returnArr;
}
