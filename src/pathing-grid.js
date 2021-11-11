'use strict';

const e = React.createElement;
var rowNum = 0;
var w,h,numRowsInGrid,numSquaresInRow,rowNum;

function fillGrid(){
  w = window.innerWidth;
  h = window.innerHeight;

  numSquaresInRow = Math.floor(w/32);
  numRowsInGrid = Math.floor((h/32)-3);
  rowNum = 0;

  const domContainer = document.querySelector('#pathing-grid-container');
  ReactDOM.render(e(Grid), domContainer);
}

//============End of function Declarations============\\

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = { empty: true, wall: false, coin: false};
  }

  changeInsideSquareDrag(e) {
    if(e.buttons == 1 || e.buttons == 3){
      const currentState = this.state.empty;
      console.log(currentState);
      if(currentState){
        //if coin do x, if wall do y
        this.setState({empty: false});
        this.setState({wall: true});
      }
    }
  };

  changeInsideSquareClick(){
    const currentState = this.state.empty;
    console.log(currentState);
    if(!currentState){
      this.setState({empty: true});
      this.setState({wall: false});
    }
  }

  render() {
    return e('button',{className: `square btn-default w-100 ${this.state.wall ? 'wall' : null}`, onMouseOver:(e) => this.changeInsideSquareDrag(e), onClick:() => this.changeInsideSquareClick(),id:`${this.props.value}`},
    );
  }
}

class Row extends React.Component {
  renderSquare(i){
    return e(Square, {value: i},);
  }

  render() {
      var renderArr = [];
      for(var i =0; i < numSquaresInRow; i++){
        renderArr.push(this.renderSquare((numSquaresInRow*rowNum)+i));
      }
      rowNum += 1;
      return e('div',{className: "square-row btn-group d-flex", role:"group"},renderArr);
    } 
}

class Grid extends React.Component {
  renderRow(){
    return e(Row);
  }
  render() {
    var renderArr = [];
    for(var i =0; i < numRowsInGrid; i++){
      renderArr.push(this.renderRow());
    }
    return e('div',{className: "full-grid", id:"full-grid"},renderArr);
  }
}

fillGrid();
window.addEventListener("resize", fillGrid);

// document.querySelectorAll('.square').forEach(item =>{
//   item.addEventListener('mouseover', function(event){
//     if(event.buttons == 1 || event.buttons == 3){
//       if(!item.classList.contains("wall")){
//         item.classList.add("wall");
//       }
//     }
//   })
// });

//Need to fix the unique key error and find a better way to display the stupid fucking grid