# Minesweeper API

[![CircleCI](https://circleci.com/gh/erickrawczyk/minesweeper.svg?style=svg)](https://circleci.com/gh/erickrawczyk/minesweeper)

This repo contains a GraphQL API for a simplified version of minesweeper. It exposes a `Game` type and a `Square` type, as well as mutations to create a game and select a square. The GraphQL playground is enabled and can be explored at https://minesweeper.kraw.cz/graphql

## Local Development

**Prerequisites**

- [Yarn](https://yarnpkg.com/) v1.13+
- [Node](https://nodejs.org/) v12+
- [Docker](https://www.docker.com) v19+, if building images locally
- [Terraform](https://www.terraform.io) v0.12+, if deploying infrastructure locally

**Application Setup**

- Run `yarn` to install dependencies and copy `.env.example` into `.env`
- Populate `.env` with proper values for the DB. This file is only for simplified local development; In production, CI pulls the values from AWS Secrets Manager
- Run `yarn start` to start a local express server on port 8080.

**Infrastructure Setup**

- Enter the `terraform` directory
- Run `terraform init` to initialize terraform
- Run `terraform plan` to review infrastructure changes
- Run `terraform apply` to deploy those changes

## Usage

The GraphQL endpoints can be queried at https://minesweeper.kraw.cz/graphql. The playground contains tabs for types in the Schema, as well as available Queries and Mutations.

Example queries and mutations have been provided here for simplicity, but most properties can be omitted from the response.

### Creating a game

The `createGame` mutation accepts two arguments, `width` and `height`, with integer values between `2` and `50` and returns a `Game` object.

**Request**

```hcl
mutation {
  createGame(width: 5, height: 5) {
    id
    createdAt
    modifiedAt
    completedAt
    height
    width
    result
    board {
      id
      gameId
      selected
      hasBomb
      x
      y
      adjacentBombs
    }
  }
}
```

**Response**

```json
{
  "data": {
    "createGame": {
      "id": "151c381b-3234-4610-9826-745d3f5afcf0",
      "createdAt": "2019-10-27T00:20:12.480Z",
      "modifiedAt": "2019-10-27T00:20:12.480Z",
      "completedAt": null,
      "height": 5,
      "width": 5,
      "result": null,
      "board": [
        [
          {
            "id": "56eaee12-6bed-4f5f-8cab-85be1e71e330",
            "gameId": "151c381b-3234-4610-9826-745d3f5afcf0",
            "selected": false,
            "hasBomb": false,
            "x": 0,
            "y": 0,
            "adjacentBombs": 0
          },
          ...
        ]
      ]
    }
  }
}
```

### Selecting a Square

The `move` mutation accepts three arguments, a uuid `gameId`, and integer values `x` and `y` and returns a `Game` object.

If the user selects a bomb or the last non-bomb square, the game will end and contain a `result` and a `completedAt` attribute.

**Request**

```hcl
mutation {
  move(gameId: "151c381b-3234-4610-9826-745d3f5afcf0", x: 2, y: 3) {
    modifiedAt
    completedAt
    result
    board {
      hasBomb
      selected
      adjacentBombs
    }
  }
}
```

**Response**

```json
{
  "data": {
    "move": {
      "modifiedAt": "2019-10-27T00:20:12.480Z",
      "completedAt": null,
      "result": null,
      "board": [
        [
          {
            "hasBomb": false,
            "selected": false,
            "adjacentBombs": 0
          },
          {
            "hasBomb": false,
            "selected": false,
            "adjacentBombs": 0
          },
          ...
        ]
      ]
    }
  }
}
```

### Listing Games

There are no arguments for the games query. This example is only requesting a few properties, although any properties of the `Game` schema can be requested.

**Request**

```hcl
query {
  games {
    id
    width
    height
    createdAt
    result
  }
}
```

**Response**

```json
{
  "data": {
    "games": [
      {
        "id": "334cfdb9-a1c3-45df-bbc1-754de27e78eb",
        "width": 5,
        "height": 5,
        "createdAt": "2019-10-26T23:02:20.801Z",
        "result": 'WON'
      },
      ...
    ]
  }
}
```

## Roadmap

- Add Unit and E2E tests

- Improve the mechanism to determine bomb distribution. The current random implementation could lead to unsolvable and/or boring games.

- Improve the board-drawing algorithm, potentially adding a `Board` type to both GraphQL and Postgres. The separation of concerns between Game and Square are blurred, and the algorithm is too mutative.

- Set up a branch workflow in CI that will deploy feature branches to a separate cluster for testing

- Expose a query for the `Square` type, and add filter arguments for the `games` query.

- Oh, and a frontend
