import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return React.createElement(
        'button',
        {
            className: 'square',
            onClick: props.onClick
        },
        props.value
    )
}

class Board extends React.Component {
    renderSquare(i) {
        return React.createElement(
            Square,
            {
                value: this.props.squares[i],
                onClick: () => this.props.onClick(i)
            },
        )
    }

    render() {
        return (
            <div>
                <div style={{display: 'flex'}}>
                    <div className="board-row">
                        {
                            [...Array(3).keys()].map(el => <div key={el}> {this.renderSquare(el)}</div>)
                        }
                    </div>
                    <div className="board-row">
                        {
                            [...Array(3).keys()].map(el => <div key={+el + 3}> {this.renderSquare(el + 3)}</div>)
                        }
                    </div>
                    <div className="board-row">
                        {
                            [...Array(3).keys()].map(el => <div key={+el + 6}> {this.renderSquare(el + 6)}</div>)
                        }
                    </div>
                </div>
            </div>
        );
    }
}

class TestText extends React.Component {
    render() {
        return React.createElement('h1', {style: {color: '#FF004F'}}, this.props.text)
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            nextX: true
        };
    }

    displayHistory(el, i) {
        return React.createElement(
            'button',
            {
                onClick: () => this.setState({
                    history: this.state.history.slice(0, i + 1),
                    nextX: (i % 2) === 0
                })
            },
            'Return to: ' + JSON.stringify(el)
        )
    }


    handleClick(i) {
        const history = [...this.state.history];
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.nextX ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            nextX: !this.state.nextX,
        });
    }

    render() {
        const history = [...this.state.history];
        const current = history[history.length - 1];
        let status = calculateWinner(current.squares) ?
            'Winner: ' + calculateWinner(current.squares) :
            'Next player: ' + (this.state.nextX ? 'X' : 'O');
        const moves = this.state.history.map((el, i) =>
            <li key={i}>
                {this.displayHistory(el.squares, i)}
            </li>);
        return (
            <div>
                <TestText text="Best app ever!"/>
                <div className="game">
                    <div className="game-board">
                        <Board onClick={(i) => this.handleClick(i)}
                               squares={current.squares}/>
                    </div>
                    <div className="game-info">
                        <div className="status">{status}</div>
                        <div className="status">Past moves:</div>
                        <ol>{moves}</ol>
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

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
