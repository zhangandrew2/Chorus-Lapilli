import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square"
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)} />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
      selected: null,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || (squares[i] && this.state.stepNumber < 6)) {
      return;
    }
    let curr = this.state.xIsNext ? 'X' : 'O';
    if (this.state.stepNumber >= 6) {
      if (this.state.selected != null) {
        if (squares[i] === null && possibleMove(this.state.selected, i)) {
          if (squares[4] === curr){                     //if center is occupied
            if(this.state.selected !== 4){                //if square selected to move isn't center
              let temp = current.squares.slice();         //then the move has to be a win
              temp[i] = curr;
              temp[this.state.selected] = null;
              if(!calculateWinner(temp)){                 //if move isn't a win
                if (squares[i]===curr){                   //but it is a square that is the player's
                  this.setState({                         //changed selected square to that one
                    selected: i,                          //else return
                  })
                }
                return;
              }
            }
          }
          squares[i] = curr;                               //if selection is the center
          squares[this.state.selected] = null;
        } else if(squares[i] === squares[this.state.selected]) {
          this.setState({
            selected: i,
          })
          return;
        }
        else{
          return;
        }
      }
      else {
        if (squares[i] === (curr)) {
          this.setState({
            selected: i,
          })
          return;
        }
        else {
          return;
        }
      }
    } else {
      squares[i] = this.state.xIsNext ? 'X' : 'O';
    }
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      selected: null,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} >{desc}</button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
function possibleMove(x,y){
  if (x === 0 && (y === 1 || y === 3 || y === 4)){
    return true;
  }
  if(x === 1 && (y === 2 || y === 3 || y === 4 || y === 5 || y === 0)){
    return true;
  }
  if(x === 2 && (y === 1 || y === 4 || y === 5)){
    return true;
  }
  if(x === 3 && (y === 0 || y === 1 || y === 4 || y === 6 || y === 7)){
    return true;
  }
  if(x === 4){
    return true;
  }
  if(x === 5 && (y === 1 || y === 2 || y === 4 || y === 7 || y === 8)){
    return true;
  }
  if(x === 6 && (y === 3 || y === 4 || y === 7)){
    return true;
  }
  if(x === 7 && (y === 3 || y === 4 || y === 5 || y === 6 || y === 8)){
    return true;
  }
  if(x === 8 && (y === 4 || y === 5 || y === 7)){
    return true;
  }
  return false;
}
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
