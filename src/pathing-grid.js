'use strict';

const e = React.createElement;

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = { objectInSquare: null };
  }

  render() {
    return e('button',{className: "square"},`${this.props.value}`,
    );
  }
}

class Grid extends React.Component {
    renderSquare(i){
        return e(Square, {value: i});
    }
    render() {
        return e('div',{className: "square-row"},[
            this.renderSquare(0),this.renderSquare(1),this.renderSquare(2),
            this.renderSquare(3),this.renderSquare(4),this.renderSquare(5),
        ]
        );
    } 
}

const domContainer = document.querySelector('#pathing-grid-container');
ReactDOM.render(e(Grid), domContainer);

//Need to fix the unique key error and find a better way to display the stupid fucking grid