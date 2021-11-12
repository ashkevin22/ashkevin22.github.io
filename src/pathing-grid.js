// import {djikstra} from '../algorithms/djikstra.js'

'use strict';

const e = React.createElement;
var clickOption = 0;
var rowNum = 0;
var w,h,numRowsInGrid,numSquaresInRow,rowNum;
var startRow = 1;
var startCol = 1;
var finishRow = 10;
var finishCol = 10;
var dragStart = false;
var dragFinish = false;
var grid = [];

for(let row = 0; row < numRowsInGrid; row++){
  var currentRow = [];
  for(let col = 0; col < numSquaresInRow; col++){
    currentRow.push(createNode(row,col));
  }
  grid.push(currentRow);
}

function createNode(row, col){
  return {
    col: col,
    row: row,
    empty: true,
    wall: false,
    coin: false,
    isStart: row == startRow && col == startCol,
    isFinish: row == finishRow && col == finishCol,
    visited: false,
    previousNode: null,
  };
}

function refreshGridResize(){
  console.log("here");
  grid = [];
  w = window.innerWidth;
  h = window.innerHeight;
  
  numSquaresInRow = Math.floor(w/32);
  numRowsInGrid = Math.floor((h/32)-3);
  rowNum = 0;
  startRow = Math.floor(numRowsInGrid/2);
  startCol = Math.floor(numSquaresInRow/5);
  finishRow = Math.floor(numRowsInGrid/2);
  finishCol = Math.floor(4*(numSquaresInRow/5));
  
  for(let row = 0; row < numRowsInGrid; row++){
    var currentRow = [];
    for(let col = 0; col < numSquaresInRow; col++){
      currentRow.push(createNode(row,col));
    }
    grid.push(currentRow);
  }

  const domContainer = document.querySelector('#pathing-grid-container');
  ReactDOM.render(e(Grid, {gridArr: grid}), domContainer);
  return grid;
}

function setClickOption(option){
  clickOption = option;
  console.log(clickOption);
}

function printGrid(){
  console.log(grid);
}

function djikstra(grid, startRow, startCol, colSize, rowSize){
  var pathArr = [];
  var visitedArr = [];
  var currentRow = startRow;
  var currentCol = startCol;
  var newGrid = JSON.parse(JSON.stringify(grid))
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
      visitedArr.push(newGrid[currentNode.row][currentNode.col]);
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
      newGrid[currentNode.row][currentNode.col].visited = true;
      currentNode = nextCurrent;
    }
    while(currentNode.isStart != true){
      pathArr.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    pathArr.unshift(currentNode);
    console.log("finished");
    var returnArr = [pathArr, visitedArr];
    return returnArr;
}

function onClickDjikstra(){
  var returnedArr = djikstra(grid, startRow, startCol, numSquaresInRow, numRowsInGrid);
  var pathArr = returnedArr[0];
  var visitedArr = returnedArr[1];
  for(let i = 0; i < (visitedArr.length+pathArr.length); i++){
    setTimeout(() => {
      if(i < visitedArr.length){
        grid[visitedArr[i].row][visitedArr[i].col].visited = true;
        var id = (visitedArr[i].row*numSquaresInRow) + visitedArr[i].col;
        var element = document.getElementById(id);
        element.classList.add('visited');
      }else{
        grid[visitedArr[i-visitedArr.length].row][visitedArr[i-visitedArr.length].col].visited = false;
        var id = (pathArr[i-visitedArr.length].row*numSquaresInRow) + pathArr[i-visitedArr.length].col;
        var element = document.getElementById(id);
        element.classList.add('path');
        element.classList.remove('visited');
      }
    }, 10 * i);
  }
}

//============End of function Declarations============\\

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      update: false
    };
  }

  updateGrid(){
    var newSquare = {
      col: this.props.squareArr.col,
      row: this.props.squareArr.row,
      empty: this.props.squareArr.empty,
      wall: this.props.squareArr.wall,
      coin: this.props.squareArr.coin,
      isStart: this.props.squareArr.isStart,
      isFinish: this.props.squareArr.isFinish,
      visited: this.props.squareArr.visited,
      previousNode: this.props.squareArr.previousNode
    }
    grid[this.props.squareArr.row][this.props.squareArr.col] = newSquare;
  }

  changeInsideSquareMup(){
    this.setState({update: !this.state.update});
    dragStart = false;
    dragFinish = false;
    if(startCol == finishCol && startRow == finishRow){
      this.updateGrid();
      return;
    }
    this.updateGrid();
  }

  changeInsideSquareMout(){
    this.setState({update: !this.state.update});
    if(dragStart){
      this.props.squareArr.empty = true;
      this.props.squareArr.isStart = false;
    }
    if(dragFinish){
      this.props.squareArr.empty = true;
      this.props.squareArr.isFinish = false;
    }
    this.updateGrid();
  }

  changeInsideSquareDrag(e) {
    this.setState({update: !this.state.update});
    if(e.buttons == 1 || e.buttons == 3){
      if(dragStart){
        startRow = this.props.row;
        startCol = this.props.col;
        this.props.squareArr.wall = false;
        this.props.squareArr.coin = false;
        this.props.squareArr.isStart = true;
        this.updateGrid();
        return;
      }
      if(dragFinish){
        finishRow = this.props.row;
        finishCol = this.props.col;
        this.props.squareArr.wall = false;
        this.props.squareArr.coin = false;
        this.props.squareArr.isFinish = true;
        this.updateGrid();
        return;
      }
      if(this.props.squareArr.isFinish || this.props.squareArr.isStart){
        this.updateGrid();
        return;
      }
      const currentState = this.props.squareArr.empty;
      if(currentState){
        if(clickOption == 0){
          this.props.squareArr.wall = true;
          this.props.squareArr.empty = false;
        }else if(clickOption == 1){
          this.props.squareArr.coin = true;
          this.props.squareArr.empty = false;
        }
      }
    }
    this.updateGrid();
  };

  changeInsideSquareMdown(){
    this.setState({update: !this.state.update});
    const currentState = this.props.squareArr.empty;
    if(this.props.squareArr.isStart){
      dragStart = true;
      this.updateGrid();
      return;
    }
    if(this.props.squareArr.isFinish){
      dragFinish = true;
      this.updateGrid();
      return;
    }
    if(!currentState){
      this.props.squareArr.wall = false;
      this.props.squareArr.empty = true;
      this.props.squareArr.coin = false;
      this.updateGrid();
      return;
    }
    if(clickOption == 1){
      this.props.squareArr.wall = false;
      this.props.squareArr.empty = false;
      this.props.squareArr.coin = true;
      this.updateGrid();
      return;
    }
    this.props.squareArr.wall = true;
    this.props.squareArr.empty = false;
    this.updateGrid();
  }

  render() {
    var imgDisplay = [];
    if(this.props.squareArr.coin){
      imgDisplay.push(e('img', {src: '../img/pixelCoin.png', className: 'img', height: '34px', width: '30px',key:`${this.props.value}`,}));
    }
    if(this.props.squareArr.isStart){
      imgDisplay.push(e('img', {src: '../img/pixelArrow.png', className: 'img', height: '34px', width: '30px',key:`${this.props.value}`,}));
    }
    if(this.props.squareArr.isFinish){
      imgDisplay.push(e('img', {src: '../img/pixelTarget.png', className: 'img', height: '34px', width: '30px',key:`${this.props.value}`,}));
    }
    return (e('button',{className: `square btn-default w-100 ${this.props.squareArr.wall ? 'wall' : ''} ${this.props.squareArr.coin ? 'coin' : ''}`, 
    onMouseOver:(e) => this.changeInsideSquareDrag(e), 
    onMouseDown:() => this.changeInsideSquareMdown(),
    onMouseUp:() => this.changeInsideSquareMup(),
    onMouseOut:() => this.changeInsideSquareMout(),
    ref: this.myRef,
    id:`${this.props.value}`,
    key:`${this.props.value}`,
    },
    imgDisplay
    ));
  }
}

class Row extends React.Component {
  renderSquare(i, squareArr){
    return e(Square, 
      {value: i, key: i, squareArr: squareArr},
      );
  }

  render() {
      var renderArr = [];
      for(var i =0; i < numSquaresInRow; i++){
        renderArr.push(this.renderSquare((numSquaresInRow*rowNum)+i, this.props.rowArr[i]));
      }
      rowNum += 1;
      return e('div',{className: "square-row btn-group d-flex", role:"group",},renderArr);
    } 
}

class Grid extends React.Component {
  renderRow(i, rowArr){
    return e(Row, {key: i, rowArr: rowArr},);
  }
  render() {
    var renderArr = [];
    for(let i = 0; i < numRowsInGrid; i++){
      renderArr.push(this.renderRow(i, this.props.gridArr[i]));
    }
    return e('div',{className: "full-grid", id:"full-grid"},renderArr);
  }
}

grid = refreshGridResize();

// console.log("tested update");
// let row = 0;
// let col = 0;
// grid[row][col] = {
//   col: col,
//   row: row,
//   empty: false,
//   wall: true,
//   coin: false,
//   isStart: row == startRow && col == startCol,
//   isFinish: row == finishRow && col == finishCol,
//   visited: false,
//   previousNode: null,
// };
// grid = refreshGrid();

window.addEventListener("resize", refreshGridResize);