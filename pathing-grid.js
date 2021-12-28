import { dijkstra } from "./algorithms/dijkstra.js";
import { Astar } from "./algorithms/A*.js";

("use strict");

const e = React.createElement;
var rowNum = 0;
var w, h, numRowsInGrid, numSquaresInRow, rowNum;
var startRow = 1;
var startCol = 1;
var finishRow = 10;
var finishCol = 10;
var dragStart = false;
var dragFinish = false;
var dragCoin = false;
var grid = [];

//initialize the grid
for (let row = 0; row < numRowsInGrid; row++) {
    var currentRow = [];
    for (let col = 0; col < numSquaresInRow; col++) {
        currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
}

//helper function to create a new node
function createNode(row, col) {
    return {
        col: col,
        row: row,
        empty: true,
        wall: false,
        coin: false,
        start: row == startRow && col == startCol,
        finish: row == finishRow && col == finishCol,
        visited: false,
        previousNode: null,
    };
}

//stop displaying path and visited nodes when something is changed
function removeAlgo() {
    for (let row = 0; row < numRowsInGrid; row++) {
        for (let col = 0; col < numSquaresInRow; col++) {
            grid[row][col].visited = false;
            var id = grid[row][col].row * numSquaresInRow + grid[row][col].col;
            var element = document.getElementById(id);
            if (element) {
                element.classList.remove("visited");
                element.classList.remove("visited2");
                element.classList.remove("path");
                element.classList.remove("path2");
            }
        }
    }
}

//recalculate how many rows and cols are needed when window is refreshed
function refreshGridResize() {
    grid = [];
    w = window.innerWidth;
    h = window.innerHeight;

    numSquaresInRow = Math.floor(w / 32);
    numRowsInGrid = Math.floor(h / 32 - 4);
    rowNum = 0;
    startRow = Math.floor(numRowsInGrid / 2);
    startCol = Math.floor(numSquaresInRow / 5);
    finishRow = Math.floor(numRowsInGrid / 2);
    finishCol = Math.floor(4 * (numSquaresInRow / 5));

    //create a new grid with the new number of nodes
    for (let row = 0; row < numRowsInGrid; row++) {
        var currentRow = [];
        for (let col = 0; col < numSquaresInRow; col++) {
            currentRow.push(createNode(row, col));
        }
        grid.push(currentRow);
    }
    //remove any leftover path or visited nodes
    removeAlgo();
    const domContainer = document.querySelector("#pathing-grid-container");
    ReactDOM.render(e(Grid, { gridArr: grid }), domContainer);
    return grid;
}

function refreshGrid(){
    const domContainer = document.querySelector("#pathing-grid-container");
    ReactDOM.render(e(Grid, { gridArr: grid }), domContainer);
}

export function clearWalls(){
    for (let row = 0; row < numRowsInGrid; row++) {
        for (let col = 0; col < numSquaresInRow; col++) {
            if(grid[row][col].wall == true){
                grid[row][col].wall = false;
                grid[row][col].empty = false;
            }
        }
    }
    refreshGrid();
}

//when called, run and display the dijkstra path
export function onClickDijkstra() {
    //remove previous algos
    removeAlgo();
    var returnedArr = dijkstra(grid, startRow, startCol, numSquaresInRow, numRowsInGrid);
    var pathArr = returnedArr[0];
    var visitedArr = returnedArr[1];
    var coinIndex = returnedArr[2];
    var coinIndexPath = returnedArr[3];
    //if a path was not found, only display the visitedArr
    if (pathArr == -1) {
        for (let i = 0; i < visitedArr.length; i++) {
            setTimeout(() => {
                grid[visitedArr[i].row][visitedArr[i].col].visited = true;
                var id = visitedArr[i].row * numSquaresInRow + visitedArr[i].col;
                var element = document.getElementById(id);
                element.classList.add("visited");
            }, 10 * i);
        }
        return;
    }
    //path was found
    for (let i = 0; i < visitedArr.length + pathArr.length; i++) {
        setTimeout(() => {
            if (i < visitedArr.length) {
                //if i was pushed after the coin was found, set it to a different color
                if (i >= coinIndex && coinIndex != 1) {
                    grid[visitedArr[i].row][visitedArr[i].col].visited = true;
                    var id = visitedArr[i].row * numSquaresInRow + visitedArr[i].col;
                    var element = document.getElementById(id);
                    element.classList.add("visited2");
                    //if i was before a coin or there was no coin, have it set to one color
                } else {
                    grid[visitedArr[i].row][visitedArr[i].col].visited = true;
                    var id = visitedArr[i].row * numSquaresInRow + visitedArr[i].col;
                    var element = document.getElementById(id);
                    element.classList.add("visited");
                }
                //if i is in path arr, display path arr
            } else {
                //if i is after coin was found, run this
                if (i >= coinIndexPath + visitedArr.length && coinIndexPath != 0) {
                    grid[visitedArr[i - visitedArr.length].row][visitedArr[i - visitedArr.length].col].visited = false;
                    var id = pathArr[i - visitedArr.length].row * numSquaresInRow + pathArr[i - visitedArr.length].col;
                    var element = document.getElementById(id);
                    //if there is overlap between paths, set display to path 2
                    if (element.classList.contains("path")) {
                        element.classList.add("path2");
                        element.classList.remove("visited");
                        //if not, add class path
                    } else {
                        element.classList.add("path");
                        element.classList.remove("visited");
                    }
                    //i is before coin was found, don't have to worry about path overlaps
                } else {
                    grid[visitedArr[i - visitedArr.length].row][visitedArr[i - visitedArr.length].col].visited = false;
                    var id = pathArr[i - visitedArr.length].row * numSquaresInRow + pathArr[i - visitedArr.length].col;
                    var element = document.getElementById(id);
                    element.classList.add("path");
                    element.classList.remove("visited");
                }
            }
        }, 10 * i);
    }
}

//called on click, runs A*, same thing as above, just with a different algo
export function onClickAstar() {
    removeAlgo();
    var returnedArr = Astar(grid, startRow, startCol, numSquaresInRow, numRowsInGrid, finishRow, finishCol);
    var pathArr = returnedArr[0];
    var visitedArr = returnedArr[1];
    var coinIndex = returnedArr[2];
    var coinIndexPath = returnedArr[3];
    if (pathArr == -1) {
        for (let i = 0; i < visitedArr.length; i++) {
            setTimeout(() => {
                grid[visitedArr[i].row][visitedArr[i].col].visited = true;
                var id = visitedArr[i].row * numSquaresInRow + visitedArr[i].col;
                var element = document.getElementById(id);
                element.classList.add("visited");
            }, 10 * i);
        }
        return;
    }
    for (let i = 0; i < visitedArr.length + pathArr.length; i++) {
        setTimeout(() => {
            if (i < visitedArr.length) {
                //if i was pushed after the coin was found, set it to a different color
                if (i >= coinIndex && coinIndex != -1) {
                    grid[visitedArr[i].row][visitedArr[i].col].visited = true;
                    var id = visitedArr[i].row * numSquaresInRow + visitedArr[i].col;
                    var element = document.getElementById(id);
                    element.classList.add("visited2");
                    //if i was before a coin or there was no coin, have it set to one color
                } else {
                    grid[visitedArr[i].row][visitedArr[i].col].visited = true;
                    var id = visitedArr[i].row * numSquaresInRow + visitedArr[i].col;
                    var element = document.getElementById(id);
                    element.classList.add("visited");
                }
                //if i is in path arr, display path arr
            } else {
                //if i is after coin was found, run this
                if (i >= coinIndexPath + visitedArr.length && coinIndexPath != 0) {
                    grid[visitedArr[i - visitedArr.length].row][visitedArr[i - visitedArr.length].col].visited = false;
                    var id = pathArr[i - visitedArr.length].row * numSquaresInRow + pathArr[i - visitedArr.length].col;
                    var element = document.getElementById(id);
                    //if there is overlap between paths, set display to path 2
                    if (element.classList.contains("path")) {
                        element.classList.add("path2");
                        element.classList.remove("visited");
                        //if not, add class path
                    } else {
                        element.classList.add("path");
                        element.classList.remove("visited");
                    }
                    //i is before coin was found, don't have to worry about path overlaps
                } else {
                    grid[visitedArr[i - visitedArr.length].row][visitedArr[i - visitedArr.length].col].visited = false;
                    var id = pathArr[i - visitedArr.length].row * numSquaresInRow + pathArr[i - visitedArr.length].col;
                    var element = document.getElementById(id);
                    element.classList.add("path");
                    element.classList.remove("visited");
                }
            }
        }, 10 * i);
    }
}

export function addRemoveCoin(){
    var textElement;
    for (let row = 0; row < numRowsInGrid; row++) {
        for(let col = 0; col < numSquaresInRow; col++){
            if(grid[row][col].coin == true){
                grid[row][col].coin = false;
                grid[row][col].empty = true;
                textElement = document.getElementById("coinText");
                textElement.innerHTML = "Add Coin";
                textElement.className = "add-coin"
                refreshGrid();
                return;
            }
        }
    }
    for (let row = 0; row < numRowsInGrid; row++) {
        for (let col = 0; col < numSquaresInRow; col++) {
            if(grid[row][col].empty){
                grid[row][col].coin = true;
                grid[row][col].empty = false;
                textElement = document.getElementById("coinText")
                textElement.innerHTML = "Remove Coin";
                textElement.className = "remove-coin"
                refreshGrid();
                return;
            }
        }
    }
}

//============End of function Declarations============\\

class Square extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            update: false,
        };
    }

    //updates the grid to contain new values
    updateGrid() {
        removeAlgo();
        var newSquare = {
            col: this.props.squareArr.col,
            row: this.props.squareArr.row,
            empty: this.props.squareArr.empty,
            wall: this.props.squareArr.wall,
            coin: this.props.squareArr.coin,
            start: this.props.squareArr.start,
            finish: this.props.squareArr.finish,
            visited: this.props.squareArr.visited,
            previousNode: this.props.squareArr.previousNode,
        };
        grid[this.props.squareArr.row][this.props.squareArr.col] = newSquare;
    }

    //checks for an invalid collision and moves to ensure that there is no collision
    //movedObj is an int
    //1 = start, 2 = finish, 3 = coin
    collision(movedObj){
        var dirs = [
            [0, 1],
            [1, 0],
            [-1, 0],
            [0, -1],
        ];
        var row = this.props.squareArr.row
        var col = this.props.squareArr.col
        for(let i = 0; i < 4; i++){
            var newRow = row + dirs[i][0];
            var newCol = col + dirs[i][1];
            if(grid[newRow][newCol].empty == true || grid[newRow][newCol].wall == true){
                if(grid[newRow][newCol].wall == true){
                    grid[newRow][newCol].wall = false;
                }
                if(movedObj == 1){
                    startRow = newRow;
                    startCol = newCol;
                    grid[row][col].start = false;
                    grid[newRow][newCol].start = true;
                    this.props.squareArr.start = false;
                }else if(movedObj == 2){
                    finishRow = newRow;
                    finishCol = newCol;
                    grid[row][col].finish = false;
                    grid[newRow][newCol].finish = true;
                    this.props.squareArr.finish = false;
                }else if(movedObj == 3){
                    grid[row][col].coin = false;
                    grid[newRow][newCol].coin = true;
                }
                break;
            }
        }
        refreshGrid();
    }

    /*  //============================================\\
    All of the "ChangeInside" functions make sure that the
    correct behavior occurs when you click and drag, just
    click, or any other click action you can do to a node
        \\============================================// */

    changeInsideSquareMup() {
        this.setState({ update: !this.state.update });
        if (startCol == finishCol && startRow == finishRow) {
            if(dragStart){
                this.collision(1);
            }else if(dragFinish){
                this.collision(2);
            }else if(dragCoin){
                this.collision(3);
            }
        }
        dragStart = false;
        dragFinish = false;
        dragCoin = false;
        this.updateGrid();
        return;
    }

    changeInsideSquareMout() {
        this.setState({ update: !this.state.update });
        if (dragStart) {
            this.props.squareArr.empty = true;
            this.props.squareArr.start = false;
            this.updateGrid();
            return;
        }
        if (dragFinish) {
            this.props.squareArr.empty = true;
            this.props.squareArr.finish = false;
            this.updateGrid();
            return;
        }
        if(dragCoin){
            this.props.squareArr.empty = true;
            this.props.squareArr.coin = false;
            this.updateGrid();
            return;
        }
    }

    changeInsideSquareDrag(e) {
        this.setState({ update: !this.state.update });
        if (e.buttons == 1 || e.buttons == 3) {
            if (dragStart) {
                startRow = this.props.squareArr.row;
                startCol = this.props.squareArr.col;
                this.props.squareArr.wall = false;
                this.props.squareArr.empty = false;
                this.props.squareArr.start = true;
                this.updateGrid();
                return;
            }
            if (dragFinish) {
                finishRow = this.props.squareArr.row;
                finishCol = this.props.squareArr.col;
                this.props.squareArr.wall = false;
                this.props.squareArr.empty = false;
                this.props.squareArr.finish = true;
                this.updateGrid();
                return;
            }
            if(dragCoin){
                this.props.squareArr.wall = false;
                this.props.squareArr.empty = false;
                this.props.squareArr.coin = true;
                this.updateGrid();
                return;
            }
            if (this.props.squareArr.finish || this.props.squareArr.start || this.props.squareArr.coin) {
                this.updateGrid();
                return;
            }
            const currentState = this.props.squareArr.empty;
            if (currentState) {
                this.props.squareArr.wall = true;
                this.props.squareArr.empty = false;
            }
        }
    }

    changeInsideSquareMdown() {
        this.setState({ update: !this.state.update });
        const currentState = this.props.squareArr.empty;
        if (this.props.squareArr.start) {
            dragStart = true;
            this.updateGrid();
            return;
        }
        if (this.props.squareArr.finish) {
            dragFinish = true;
            this.updateGrid();
            return;
        }
        if(this.props.squareArr.coin){
            dragCoin = true;
            this.updateGrid();
            return;
        }
        if (!currentState) {
            if(!this.props.squareArr.coin){
                this.props.squareArr.wall = false;
                this.props.squareArr.empty = true;
                this.props.squareArr.coin = false;
                this.updateGrid();
            }
            return;
        }
        this.props.squareArr.wall = true;
        this.props.squareArr.empty = false;
        this.updateGrid();
    }

    //renders every node, checks if there needs to be an image in the node
    //based on the value of one of the props values
    render() {
        var imgDisplay = [];
        if (this.props.squareArr.coin) {
            imgDisplay.push(
                e("img", {
                    src: "img/pixelCoin.png",
                    className: "img",
                    key: `${this.props.value}`,
                })
            );
        }
        if (this.props.squareArr.start) {
            imgDisplay.push(
                e("img", {
                    src: "img/pixelArrow.png",
                    className: "img",
                    key: `${this.props.value}`,
                })
            );
        }
        if (this.props.squareArr.finish) {
            imgDisplay.push(
                e("img", {
                    src: "img/pixelTarget.png",
                    className: "img",
                    key: `${this.props.value}`,
                })
            );
        }
        return e(
            "button",
            {
                className: `square btn-default w-100 ${this.props.squareArr.wall ? "wall" : ""} ${this.props.squareArr.coin ? "coin" : ""}`,
                onMouseOver: (e) => this.changeInsideSquareDrag(e),
                onMouseDown: () => this.changeInsideSquareMdown(),
                onMouseUp: () => this.changeInsideSquareMup(),
                onMouseOut: () => this.changeInsideSquareMout(),
                ref: this.myRef,
                id: `${this.props.squareArr.row * numSquaresInRow + this.props.squareArr.col}`,
                key: `${this.props.squareArr.row * numSquaresInRow + this.props.squareArr.col}`,
            },
            imgDisplay
        );
    }
}

class Row extends React.Component {
    renderSquare(i, squareArr) {
        return e(Square, { value: i, key: i, squareArr: squareArr });
    }

    render() {
        var renderArr = [];
        for (var i = 0; i < numSquaresInRow; i++) {
            renderArr.push(this.renderSquare(numSquaresInRow * rowNum + i, this.props.rowArr[i]));
        }
        rowNum += 1;
        return e("div", { className: "square-row btn-group d-flex", role: "group" }, renderArr);
    }
}

class Grid extends React.Component {
    renderRow(i, rowArr) {
        return e(Row, { key: i, rowArr: rowArr });
    }
    render() {
        var renderArr = [];
        for (let i = 0; i < numRowsInGrid; i++) {
            renderArr.push(this.renderRow(i, this.props.gridArr[i]));
        }
        return e("div", { className: "full-grid", id: "full-grid" }, renderArr);
    }
}

grid = refreshGridResize();

window.addEventListener("resize", refreshGridResize);
