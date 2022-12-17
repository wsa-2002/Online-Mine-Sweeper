# 111-1 CN Final Project: 2 Player Online Minesweeper
by amber, erica, jtc, daphne, wsa

## About This Project
This is a 2 Player Online Minesweeper. You can either create an empty room and invite your friend, enter a random room, or join a specific room that your friend has created. Players take turns to either take a step or place a flag. In addition to original features of Minesweeper, we add timer into our game, to make the competition more thrilled. Enjoy the match!

## Setup
### Backend & Database Setup

```shell
cd be
cp .env.example .env
cp docker-compose.yaml.example docker-compose.yaml
```

Fill in necessary environment variables in `.env`.
```
MONGO_URI="mongodb://root:example@host.docker.internal:27017"
DATABASE="network-project"
SERVICE_ADDRESS=":8000"
```

Then run
```shell
docker-compose up --build -d
```
You may check whether the database is up from `localhost:8082`, and the websocket connection endpoint is `ws://<SERVICE_ADDRESS>/socket`


### Frontend Setup

```shell
cd fe
cp .env.example .env
```

Fill in the below environment variable in `.env`.
```shell
REACT_APP_ClIENT_ADDRESS="ws://localhost:8000/socket"
```

Then run
```
yarn start
```

## How to start and play
Open http://localhost:3000.