const esmImport = require('esm')(module);
const { buildBoard } = esmImport('./buildBoard');

/*
Expected Board
B X X 
X X B
X X X
*/
const squares = [
  { x: 0, y: 0, has_bomb: true },
  { x: 1, y: 0, has_bomb: false },
  { x: 2, y: 0, has_bomb: false },
  { x: 0, y: 1, has_bomb: false },
  { x: 1, y: 1, has_bomb: false },
  { x: 2, y: 1, has_bomb: true },
  { x: 0, y: 2, has_bomb: false },
  { x: 1, y: 2, has_bomb: false },
  { x: 2, y: 2, has_bomb: false },
];

describe('buildBoard', () => {
  let board;

  beforeEach(() => {
    board = buildBoard(squares);
  });

  test('Creates correct sized board', () => {
    expect(board.length).toEqual(3);
    board.forEach(row => {
      expect(row.length).toEqual(3);
    });
  });

  test('Calculates adjacent bombs', () => {
    const board = buildBoard(squares);
    expect(board[0][0].adjacentBombs).toEqual(0);
    expect(board[0][1].adjacentBombs).toEqual(2);
    expect(board[0][2].adjacentBombs).toEqual(1);
    expect(board[1][0].adjacentBombs).toEqual(1);
    expect(board[1][1].adjacentBombs).toEqual(2);
    expect(board[1][2].adjacentBombs).toEqual(0);
    expect(board[2][0].adjacentBombs).toEqual(0);
    expect(board[2][1].adjacentBombs).toEqual(1);
    expect(board[2][2].adjacentBombs).toEqual(1);
  });
});
