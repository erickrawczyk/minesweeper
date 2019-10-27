const QueryExecutor = require('../utils/QueryExecutor');

describe('Game', () => {
  test('list games', async () => {
    const query = `
      query {
        games {
          id
        }
      }
    `;

    const { executeQuery } = new QueryExecutor([{ id: 'foo' }, { id: 'bar' }]);
    const res = await executeQuery({ query });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      games: [{ id: 'foo' }, { id: 'bar' }],
    });
  });

  test('Throws error for invalid fields', async () => {
    const query = `
      query {
        games {
          id
        }
      }
    `;

    const { executeQuery } = new QueryExecutor([{ poopy: 'butt' }]);
    const res = await executeQuery({ query });
    expect(res.errors).toHaveLength(1);
  });

  test('Translates postgres fields', async () => {
    const date = '2019-10-27T03:48:53.822Z';
    const query = `
      query {
        games {
          createdAt
          modifiedAt
          completedAt
        }
      }
    `;

    const { executeQuery } = new QueryExecutor([
      { created_at: date, modified_at: date, completed_at: date },
    ]);

    const res = await executeQuery({ query });
    const [game] = res.data.games;

    expect(game).toEqual({
      createdAt: date,
      modifiedAt: date,
      completedAt: date,
    });
  });

  test('Bypasses squares query if board is provided', async () => {
    const board = [
      [{ x: 0, y: 0 }, { x: 1, y: 0 }],
      [{ x: 0, y: 1 }, { x: 1, y: 1 }],
    ];

    const query = `
      query {
        games {
          board {
            x
            y
          }
        }
      }
    `;

    const { executeQuery, db } = new QueryExecutor([{ id: 'foo', board }]);
    const res = await executeQuery({ query });
    const [game] = res.data.games;

    expect(game.board).toEqual(board);
    expect(db).not.toHaveBeenCalledWith('squares');
  });

  test('createGame input validation minimum', async () => {
    const query = `
      mutation {
        createGame(width: 0, height: 0)
      }
    `;
    const { executeQuery, db } = new QueryExecutor([{ id: 'foo' }]);
    const res = await executeQuery({ query });
    expect(res.errors).toHaveLength(1);
    expect(db).not.toHaveBeenCalled();
  });

  test('createGame input validation maximum', async () => {
    const query = `
      mutation {
        createGame(width: 9999, height: 9999)
      }
    `;
    const { executeQuery, db } = new QueryExecutor([{ id: 'foo' }]);
    const res = await executeQuery({ query });
    expect(res.errors).toHaveLength(1);
    expect(db).not.toHaveBeenCalled();
  });

  test('createGame creates game', async () => {
    const query = `
      mutation {
        createGame(width: 3, height: 3) {
          id
        }
      }
    `;
    const { executeQuery, db } = new QueryExecutor([{ id: 'foo' }]);
    const res = await executeQuery({ query });
    expect(res.errors).toBeUndefined();
    expect(db).toHaveBeenCalledWith('games');
    expect(db).toHaveBeenCalledWith('squares');
  });
});
