# Online MineSweeper

### Env setup
If you haven't installed go yet, run the following command:
```shell
brew install go
```
or visit https://go.dev/doc/install and download package that fix your OS.

### Start
```shell
cp .env.example .env
cp docker-compose.yaml.example docker-compose.yaml
```
And fill in necessary environment variables in `.env`, then run
```shell
go mod tidy
go run main.go
```
You may check the connection through `<SERVICE_ADDRESS>/socket`
