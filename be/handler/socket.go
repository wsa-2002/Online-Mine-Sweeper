package handler

import (
	"be/service"
	"encoding/json"
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"net/http"
	"sync"
)

type Response struct {
	Task  string      `json:"task"`
	Data  interface{} `json:"data"`
	Error error       `json:"error,omitempty"`
}

type Request struct {
	Task     string           `json:"task"`
	Username string           `json:"username"`
	Data     *json.RawMessage `json:"data"`
}

type wsClients struct {
	Conn       *websocket.Conn `json:"conn"`
	Username   string          `json:"username"`
	RoomNumber int             `json:"room_number,omitempty"`
}

var (
	rooms      = make(map[int][]wsClients)
	socketData Request
	mutex      sync.Mutex
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
		if err := json.Unmarshal(msg, &socketData); err != nil {
			err = ws.WriteJSON(Response{
				"error",
				nil,
				err,
			})
		}
		username := socketData.Username
		switch socketData.Task {
		case "setup":
			var data service.SetUpInput
			if err := json.Unmarshal(*socketData.Data, &data); err != nil {
				err = ws.WriteJSON(Response{
					"setup",
					nil,
					err,
				})
			}
			setUpResult, setUpErr := service.SetUp(username, data)
			handleConnections(ws, setUpResult.RoomNumber)
			err = ws.WriteJSON(Response{
				"setup",
				setUpResult,
				setUpErr,
			})
		case "ready":
			var data service.ReadyInput
			if err := json.Unmarshal(*socketData.Data, &data); err != nil {
				err = ws.WriteJSON(Response{
					"ready",
					nil,
					err,
				})
			}
			readyResult, readyErr := service.HandleReady(username, data)
			err = ws.WriteJSON(Response{
				"ready",
				readyResult,
				readyErr,
			})
		case "action":
			var data service.ActionInput
			if err := json.Unmarshal(*socketData.Data, &data); err != nil {
				err = ws.WriteJSON(Response{
					"ready",
					nil,
					err,
				})
			}
			actionResult, actionErr := service.HandleAction(username, data)
			err = ws.WriteJSON(Response{
				"update_board",
				actionResult,
				actionErr,
			})
		case "check_status":
			var data service.CheckStatusInput
			if err := json.Unmarshal(*socketData.Data, &data); err != nil {
				err = ws.WriteJSON(Response{
					"check_status",
					nil,
					err,
				})
			}
			checkStatusResult, checkStatusErr := service.CheckStatus(username, data)
			err = ws.WriteJSON(Response{
				"check_status",
				checkStatusResult,
				checkStatusErr,
			})
		default:
			err = ws.WriteJSON(Response{
				socketData.Task,
				nil,
				errors.New("invalid task type"),
			})
		}
		if err != nil {
			panic(err)
		}
	}
}

func handleConnections(c *websocket.Conn, roomNumber int) {
	mutex.Lock()
	rooms[roomNumber] = append(rooms[roomNumber], wsClients{
		c,
		socketData.Username,
		roomNumber,
	})
	mutex.Unlock()
}
