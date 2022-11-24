package handler

import (
	"be/persistence"
	"fmt"
	"github.com/bitly/go-simplejson"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"net/http"
)

func SocketHandler(c *gin.Context) {
	upGrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}

	ws, err := upGrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		panic(err)
	}
	defer func() {
		closeSocketErr := ws.Close()
		if closeSocketErr != nil {
			panic(err)
		}
	}()

	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			panic(err)
		}

		//var socketData map[string]interface{}
		socketData, err := simplejson.NewJson(msg)
		if err != nil {
			panic(err)
		}
		//fmt.Println(socketData.Get("type").MustString())
		switch socketData.Get("type").MustString() {
		case "set_user":
			data := socketData.Get("data")
			result := persistence.CreateUser(data.Get("username").MustString())
			fmt.Println(result)
			fmt.Println("jkjk")
			err = ws.WriteJSON(struct {
				UserId int `json:"user_id"`
			}{
				1,
			})
		default:
			err = ws.WriteJSON(struct {
				Reply string `json:"reply"`
			}{
				"no such action",
			})
		}
		if err != nil {
			panic(err)
		}
	}
}
