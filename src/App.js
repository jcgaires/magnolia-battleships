import { useState, useEffect } from 'react';
import generateBoardAndShips from './generateBoardAndShips';
import GameOver from './GameOver';
import './App.css';

const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const initialShips = [
  { id: 'supa', name: 'Battleship', size: 5 },
  { id: 'dupa', name: 'Destroyer', size: 4 },
  { id: 'cool', name: 'Destroyer', size: 4 },
];

function App() {

  const [board, setBoard] = useState([]);
  const [ships, setShips] = useState([]);
  const [shipsCoords, setShipsCoords] = useState([]);
  const [aimPoint, setAimPoint] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [shotResult, setShotResult] = useState('');

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    if(shotResult) setShotResult('');
    if(aimPoint) setAimPoint('');
    const boardAndShips = generateBoardAndShips(cols, rows, initialShips);
    setBoard(boardAndShips.board);
    setShips(boardAndShips.ships);
    setShipsCoords(boardAndShips.ships.reduce((acc, ship) => ([...acc, ...ship.coords]), []));
    if(gameOver) setGameOver(false);
  }

  const shoot = (target) => {

    // set shot result
    const shotCoord = board.find((point) => point.id === target.toUpperCase());
    // invalid coordinate
    if(!shotCoord) {
      return setShotResult('That\'s an invalid coordinate.');
    // repeat shot
    } else if(shotCoord.shot) {
      setShotResult('You shot that one already!');
    // shot a ship
    } else if(shotCoord.hasShip) {

      const hitShip = ships.find((ship) => ship.id === shotCoord.shipId);
      const didSink = hitShip.shotsMissing.length === 1;

      setShotResult(didSink ? `Awesome! You sank a ${hitShip.name}!` : 'You hit a ship!');

      // set shot on the ship
      setShips(ships.map((ship) => ship.id === hitShip.id ? ({ ...ship, shotsMissing: ship.shotsMissing.filter(s => s.id !== shotCoord.id) }) : ship));

    // missed
    } else {
      setShotResult('Sorry, you missed!');
    }

    // set shot on the board
    const newBoard = board.map((cell) => ({ ...cell, shot: cell.shot || cell.id === shotCoord.id }));
    setBoard(newBoard);

    // check if game over
    const isGameOver = shipsCoords.reduce((acc, coord) => {
      if(!acc) return false;
      return !!newBoard.find((point) => point.id === coord.id && point.shot);
    }, true);

    if(isGameOver) setGameOver(true);
  }

  if(gameOver)
    return <GameOver board={board} onPlayAgain={startGame} />;

  return (
    <div className="app">

      <h1 className="main-title">Battleships <span className="signature">by João Aires</span></h1>
      <p className="main-description">Click the grid or enter coordinates manually to sink all the ships.</p>

      <div className="board">
        <div className="board__header board__header--cols">
          { cols.map((col) => (
            <div className="board__header__item" key={`header_col_${col}`}>{col}</div>
          )) }
        </div>
        <div className="board__header board__header--rows">
          { rows.map((row) => (
            <div className="board__header__item" key={`header_row_${row}`}>{row}</div>
          )) }
        </div>
        <div className="board__grid">
          { board && board.length && board.map((cell) => (
            <div
              className={`board__cell ${cell.hasShip ? `board__cell--hasShip` : null} ${cell.shot ? `board__cell--shot` : null}`}
              onClick={() => shoot(cell.id)}
              key={cell.id} />
          ))}
        </div>
      </div>

      <div className="form">
        <input className="form__input" placeholder="Enter coordinates"
          onChange={e => setAimPoint(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && shoot(aimPoint)} />
        <button className="form__button" onClick={() => shoot(aimPoint)}>Fire away!</button>
      </div>

      <div className="ships">
        { gameOver ? (<h2>Game Over!</h2>) : null }
        { ships.map((ship, shipIndex) => (
          <div className="ship" key={`${ship.name}_${shipIndex}`}>
            { ship.coords.map((coord) => {
              const isShot = board.find(c => c.id === coord.id && c.shot);
              return (
                <div className={`ship__coord ${isShot ? `ship__cord--shot` : null}`} key={coord.id} />
              );
            })}
          </div>
        )) }
      </div>

      { shotResult ? (
        <div className="shot-result-toaster">{shotResult}</div>
      ) : null }
    </div>
  );
}

export default App;
