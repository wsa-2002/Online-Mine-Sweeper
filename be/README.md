# Online MineSweeper

### Setup

```shell
cp .env.example .env
cp docker-compose.yaml.example docker-compose.yaml
```
And fill in necessary environment variables in `.env`, then run

```shell
docker-compose up --build -d
```
You may check whether the database is up from `localhost:8082`, and the websocket connection endpoint is `<SERVICE_ADDRESS>/socket`
