package main

import (
	"be/handler"
	"be/persistence"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"os"
)

func main() {
	envErr := godotenv.Load()
	if envErr != nil {
		panic(envErr)
	}

	mongoUri := os.Getenv("MONGO_URI")
	dbName := os.Getenv("DATABASE")

	stuck := make(chan os.Signal)
	dbErr := persistence.Init(mongoUri, dbName)
	defer func() {
		if err := persistence.Close(); err != nil {
			panic(err)
		}
	}()
	if dbErr != nil {
		panic(dbErr)
	}
	ServeHTTP()

	<-stuck
}

func ServeHTTP() {
	go func() {
		g := gin.New()
		g.Use(gin.Recovery())
		err := g.SetTrustedProxies(nil)
		if err != nil {
			panic(err)
		}

		public := g.Group("/socket")
		public.GET("", handler.SocketHandler)

		if err := g.Run(":8000"); err != nil {
			panic(err)
		}
	}()
}
