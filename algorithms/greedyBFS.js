export function greedyBFS(grid, startRow, startCol, finishRow, finishCol, colSize, rowSize){
    
    var queue = [];
    var pathArr = [];
    var pathArr2 = [];
    var visitedArr = [];
    var currentNode;
    var returnArr = [];
    var foundCoinIndex;
    var foundCoinIndexPath;
    var boolCoin;
    var boolFoundCoin = false;
    var coinRow;
    var coinCol;
    var newGrid = JSON.parse(JSON.stringify(grid));

    for(let i = 0; i < rowSize; i++){
        for(let j = 0; j < colSize; j++){
            if(newGrid[i][j].coin){
                boolCoin = true;
                coinRow = i;
                coinCol = j
            }
            newGrid[i][j].visited = 0;
        }
    }

    var dirs = [
        [0, 1],
        [1, 0],
        [-1, 0],
        [0, -1],
    ];

    if(boolCoin){
        newGrid[startRow][startCol].visited = true;
        queue.push(newGrid[startRow][startCol]);
        while(queue.length != 0){
            currentNode = findLowest(queue, coinRow, coinCol);
            visitedArr.push(currentNode);
            if(currentNode.coin){
                startRow = currentNode.row;
                startCol = currentNode.col;
                foundCoinIndex = visitedArr.length;
                while(currentNode != null){
                    pathArr2.unshift(currentNode);
                    currentNode = currentNode.previousNode;
                }
                foundCoinIndexPath = pathArr2.length;
                boolFoundCoin = true;
                break;
            }
            dirs.forEach((dir) => {
                if (currentNode.row + dir[0] >= 0 && currentNode.col + dir[1] >= 0 && currentNode.row + dir[0] < rowSize && currentNode.col + dir[1] < colSize) {
                    var searchingNode = newGrid[currentNode.row + dir[0]][currentNode.col + dir[1]];
                    if(searchingNode.visited == false && searchingNode.wall == false){
                        searchingNode.previousNode = currentNode;
                        queue.push(searchingNode);
                        searchingNode.visited = true;
                    }
                }
            })
        }
        if(!boolFoundCoin){
            console.log("no remaining nodes");
            returnArr = [-1, visitedArr, -1, -1];
            return returnArr;
        }
    }

    queue = [];
    var newGrid = JSON.parse(JSON.stringify(grid));

    newGrid[startRow][startCol].visited = true;
    queue.push(newGrid[startRow][startCol]);
    while(queue.length != 0){
        currentNode = findLowest(queue, finishRow, finishCol);
        visitedArr.push(currentNode);
        if(currentNode.finish){
            while(currentNode != null){
                pathArr.unshift(currentNode);
                currentNode = currentNode.previousNode;
            }
            pathArr2.push.apply(pathArr2, pathArr);
            returnArr = [pathArr2, visitedArr, foundCoinIndex, foundCoinIndexPath];
            return returnArr;
        }
        dirs.forEach((dir) => {
            if (currentNode.row + dir[0] >= 0 && currentNode.col + dir[1] >= 0 && currentNode.row + dir[0] < rowSize && currentNode.col + dir[1] < colSize) {
                var searchingNode = newGrid[currentNode.row + dir[0]][currentNode.col + dir[1]];
                if(searchingNode.visited == false && searchingNode.wall == false){
                    searchingNode.previousNode = currentNode;
                    queue.push(searchingNode);
                    searchingNode.visited = true;
                }
            }
        })
    }
    console.log("no remaining nodes");
    return [-1, visitedArr, -1, -1];
}

function findLowest(queue, finishRow, finishCol){
    var index;
    var lowest_dist = Number.MAX_SAFE_INTEGER;
    var distance;
    var lowest_node;

    for(let i = 0; i < queue.length; i++){
        distance = (Math.abs(queue[i].row - finishRow) + Math.abs(queue[i].col - finishCol))
        if(distance < lowest_dist){
            lowest_dist = distance;
            index = i;
        }
    }
    lowest_node = queue[index];
    queue.splice(index,1);
    return lowest_node;
}