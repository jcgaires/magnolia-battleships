import { getRandomItem } from './helpers';

const generateShipCoords = (board, ship) => {

  // randomize starting point and orientation of the ship
  const startingPoint = getRandomItem(board);
  const orientation = getRandomItem(['vertical', 'horizontal']);
  // set first coord to random starting point
  let shipCoords = [startingPoint];

  // calculate and push next points based on the size and orientation of the ship
  for(let i = 0; i < ship.size - 1; i++) {

    const lastPoint = shipCoords[shipCoords.length - 1] || {};
    const nextPointCoords = {
      x: orientation === 'vertical' ? lastPoint.x : lastPoint.x + 1,
      y: orientation === 'vertical' ? lastPoint.y + 1 : lastPoint.y,
    };
    const nextPoint = board.find(point => point.x === nextPointCoords.x && point.y === nextPointCoords.y);
    shipCoords.push(nextPoint);
  }

  // validate + if there's an invalid point, generate again
  const otherShipsPoints = board.filter(s => s.hasShip).map(s => s.id);
  if(shipCoords.includes(undefined) || shipCoords.find(c => otherShipsPoints.includes(c.id)))
    return generateShipCoords(board, ship);
  // else return the coords
  return shipCoords;

}

export default (cols, rows, initialShips) => {

  let board = [];

  // create empty board
  board = cols.reduce((acc, col, colIndex) => {

    // build row for that number
    const row = rows.map((r, rowIndex) => ({ id: `${col}${r}`, x: colIndex, y: rowIndex }));

    // dump full row into board
    return [ ...acc, ...row ];

  }, []);

  // create ships
  let ships = initialShips;

  // set ships position
  for(let shipIndex = 0; shipIndex < ships.length; shipIndex++) {
    let updatedBoard = board;
    const ship = ships[shipIndex];
    const shipCoords = generateShipCoords(board, ship);

    // update ship object with coords
    ships[shipIndex].coords = shipCoords;
    ships[shipIndex].shotsMissing = shipCoords;

    // set ships position on board
    for(let shipCoordIndex = 0; shipCoordIndex < shipCoords.length; shipCoordIndex++) {
      board[board.findIndex((cell) => cell.id === shipCoords[shipCoordIndex].id)].hasShip = true;
      board[board.findIndex((cell) => cell.id === shipCoords[shipCoordIndex].id)].shipId = ship.id;
    }
  }

  return { board, ships };

}
