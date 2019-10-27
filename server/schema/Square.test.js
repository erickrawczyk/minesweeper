const QueryExecutor = require('../utils/QueryExecutor');

describe('Square', () => {
  test('Can not select a square that does not exist', async () => {
    const query = `
      mutation {
        move(gameId: "foo", x: 999, y: 999) {
          id
        }
      }
    `;
    const { executeQuery, db } = new QueryExecutor(undefined);
    const res = await executeQuery({ query });
    expect(res.errors).toHaveLength(1);
  });

  test('Can not select already selected squares', async () => {
    const query = `
      mutation {
        move(gameId: "foo", x: 0, y: 0) {
          id
        }
      }
    `;
    const { executeQuery, db } = new QueryExecutor({
      x: 0,
      y: 0,
      selected: true,
    });
    const res = await executeQuery({ query });
    expect(res.errors).toHaveLength(1);
  });

  test('Game ends if bomb is selected', async () => {
    const query = `
      mutation {
        move(gameId: "foo", x: 0, y: 0) {
          id
        }
      }
    `;
    const { executeQuery, db } = new QueryExecutor([
      {
        x: 0,
        y: 0,
        selected: false,
        has_bomb: true,
      },
    ]);
    const res = await executeQuery({ query });
    const gameCalls = db.mock.calls.filter(([call]) => call === 'games');
    expect(gameCalls).toHaveLength(1);
  });

  test('Game ends if all non-bomb squares are selected', async () => {
    const query = `
      mutation {
        move(gameId: "foo", x: 0, y: 0) {
          id
        }
      }
    `;
    const { executeQuery, db } = new QueryExecutor([
      {
        x: 0,
        y: 1,
        selected: true,
        has_bomb: true,
      },
      {
        x: 1,
        y: 1,
        selected: false,
        has_bomb: true,
      },
      {
        x: 0,
        y: 0,
        selected: false,
        has_bomb: true,
      },
    ]);
    const res = await executeQuery({ query });
    const gameCalls = db.mock.calls.filter(([call]) => call === 'games');
    expect(gameCalls).toHaveLength(1);
  });
});
