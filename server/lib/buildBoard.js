const getAdjacentCoordinates = (x, y) => {
  const above = y - 1;
  const below = y + 1;
  const left = x - 1;
  const right = x + 1;

  // tuples in the form of [x, y]
  const adjacentSquares = [
    [left, above],
    [x, above],
    [right, above],
    [left, y],
    [right, y],
    [left, below],
    [x, below],
    [right, below],
  ];

  return adjacentSquares;
};

const addAdjacentSquares = board => {
  board.forEach((row, y) => {
    row.forEach((square, x) => {
      board[y][x].adjacentBombs = getAdjacentCoordinates(x, y).reduce(
        (sum, [xCur, yCur]) => {
          const square = board[yCur] ? board[yCur][xCur] : null;
          if (xCur < 0 || yCur < 0) return sum;
          if (square && square.has_bomb) return sum + 1;
          return sum;
        },
        0,
      );
    });
  });
};

// generate board from squares
export const buildBoard = squares => {
  const board = [];
  squares.forEach(square => {
    const { x, y } = square;
    if (typeof board[y] === 'undefined') board[y] = [];
    if (typeof board[y][x] === 'undefined') board[y][x] = square;
  });

  addAdjacentSquares(board);

  return board;
};

export default buildBoard;
