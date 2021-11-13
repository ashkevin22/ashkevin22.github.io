export function djikstra(grid, startRow, startCol, colSize, rowSize){
  var coinsCollected = 0;
  var coinCount = 0;
  var pathArr = [];
  var pathArr2 = [];
  var visitedArr = [];
  var currentRow = startRow;
  var currentCol = startCol;
  var foundCoinIndex = -1;
  var newGrid = JSON.parse(JSON.stringify(grid))
  for(var i = 0; i < rowSize; i++){
      for(var j = 0; j < colSize; j++){
        newGrid[i][j].distance = Number.MAX_SAFE_INTEGER;
        if(newGrid[i][j].coin == true){
            coinCount ++;
        }
      }
  }
  newGrid[startRow][startCol].distance = 0;
  var dirs = [[0,1],[1,0],[-1,0],[0,-1]];
  var currentNode = newGrid[currentRow][currentCol];
  pathArr.unshift(currentNode);
  while(coinsCollected != coinCount){
    console.log("here");
    if(currentNode.coin == true){
        console.log("coin");
        coinsCollected ++;
        startCol = currentNode.col;
        startRow = currentNode.row;
        if(coinsCollected < coinCount){
            currentNode = newGrid[currentRow][currentCol];
        }
        continue;
    }
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
    visitedArr.push(newGrid[currentNode.row][currentNode.col]);
    var nextCurrent = {
        distance: Number.MAX_SAFE_INTEGER
    }
    for(let row = 0; row < rowSize; row++){
        for(let col = 0; col < colSize; col++){
            if(newGrid[row][col].distance < nextCurrent.distance && newGrid[row][col].visited == false && newGrid[row][col].wall == false){
              nextCurrent = newGrid[row][col];
            }
        }
    }
    if(nextCurrent.distance == Number.MAX_SAFE_INTEGER){
        console.log("no other reachable nodes");
        var returnArr = [-1, visitedArr];
        return returnArr;
    }
    newGrid[currentNode.row][currentNode.col].visited = true;
    currentNode = nextCurrent;
  }
  foundCoinIndex = visitedArr.length;
  while(currentNode.previousNode != null){
    pathArr.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  var newGrid = JSON.parse(JSON.stringify(grid))
  for(var i = 0; i < rowSize; i++){
      for(var j = 0; j < colSize; j++){
        newGrid[i][j].distance = Number.MAX_SAFE_INTEGER;
      }
  }
  newGrid[startRow][startCol].distance = 0;
  var currentNode = newGrid[startRow][startCol];
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
      visitedArr.push(newGrid[currentNode.row][currentNode.col]);
      var nextCurrent = {
          distance: Number.MAX_SAFE_INTEGER
      }
      for(let row = 0; row < rowSize; row++){
          for(let col = 0; col < colSize; col++){
              if(newGrid[row][col].distance < nextCurrent.distance && newGrid[row][col].visited == false && newGrid[row][col].wall == false){
                nextCurrent = newGrid[row][col];
              }
          }
      }
      if(nextCurrent.distance == Number.MAX_SAFE_INTEGER){
          console.log("no other reachable nodes");
          var returnArr = [-1, visitedArr];
          return returnArr;
      }
      newGrid[currentNode.row][currentNode.col].visited = true;
      currentNode = nextCurrent;
    }
    while(currentNode != null){
      pathArr2.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    pathArr.push.apply(pathArr, pathArr2);
    var returnArr = [pathArr, visitedArr, foundCoinIndex];
    return returnArr;
}