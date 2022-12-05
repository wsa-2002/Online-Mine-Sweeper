package handler

import (
	"be/service"
	"encoding/json"
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"net/http"
	"sync"
	"time"
)

type Response struct {
	Task  string      `json:"task"`
	Data  interface{} `json:"data"`
	Error string      `json:"error"`
}

type Request struct {
	Task     string           `json:"task"`
	Username string           `json:"username"`
	Data     *json.RawMessage `json:"data"`
}

type wsClient struct {
	Conn       *websocket.Conn `json:"conn"`
	Username   string          `json:"username"`
	RoomNumber int             `json:"room_number,omitempty"`
}

var (
	rooms      = make(map[int][]wsClient)
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
		requestTime := time.Now()
		if err != nil {
			panic(err)
		}

		if err := json.Unmarshal(msg, &socketData); err != nil {
			handleResponse(ws, "error", nil, err)
		}
		username := socketData.Username
		switch socketData.Task {
		case "setup":
			var data service.SetUpInput
			if err := json.Unmarshal(*socketData.Data, &data); err != nil {
				handleResponse(ws, "setup", nil, err)
			}
			setUpResult, setUpErr := service.SetUp(username, data)
			handleResponse(ws, "setup", setUpResult, setUpErr)
			if setUpErr == nil {
				handleConnections(ws, setUpResult.RoomNumber)
				notifyUser(username, setUpResult.RoomNumber, "setup", service.SetUpOutput{
					BoardSize:     setUpResult.BoardSize,
					MineNum:       setUpResult.MineNum,
					TimeLimit:     setUpResult.TimeLimit,
					RoomType:      setUpResult.RoomType,
					RoomNumber:    setUpResult.RoomNumber,
					RivalUsername: username,
				})
			}
		case "ready":
			var data service.ReadyInput
			if err := json.Unmarshal(*socketData.Data, &data); err != nil {
				handleResponse(ws, "ready", nil, err)
			}
			readyResult, readyErr := service.HandleReady(username, data)
			if readyErr != nil {
				handleResponse(ws, "ready", readyResult, readyErr)
			}
			if readyResult != nil {
				handleResponse(ws, "ready", readyResult, readyErr)
				notifyUser(username, data.RoomNumber, "ready", readyResult)
			}
		case "action":
			var data service.ActionInput
			if err := json.Unmarshal(*socketData.Data, &data); err != nil {
				handleResponse(ws, "ready", nil, err)
			}
			actionResult, actionErr := service.HandleAction(username, data, requestTime)
			handleResponse(ws, "update_board", actionResult, actionErr)
			if actionErr == nil {
				notifyUser(username, data.RoomNumber, "update_board", actionResult)
				if actionResult.Status == "GAMEOVER" {
					RemoveRoomConnection(data.RoomNumber)
				}
			}

		case "check_status":
			var data service.CheckStatusInput
			if err := json.Unmarshal(*socketData.Data, &data); err != nil {
				handleResponse(ws, "check_status", nil, err)
			}
			checkStatusResult, checkStatusErr := service.CheckStatus(username, data)
			handleResponse(ws, "check_status", checkStatusResult, checkStatusErr)
		default:
			handleResponse(ws, socketData.Task, nil, errors.New("invalid task type"))
		}
		if err != nil {
			handleResponse(ws, socketData.Task, nil, err)
		}
	}
}

func handleConnections(c *websocket.Conn, roomNumber int) {
	mutex.Lock()
	rooms[roomNumber] = append(rooms[roomNumber], wsClient{
		c,
		socketData.Username,
		roomNumber,
	})
	mutex.Unlock()
}

func handleResponse(c *websocket.Conn, task string, data interface{}, err error) {
	if err != nil {
		err = c.WriteJSON(Response{
			task,
			data,
			err.Error(),
		})
	} else {
		err = c.WriteJSON(Response{
			task,
			data,
			"",
		})
	}
}

func notifyUser(sender string, roomId int, task string, data interface{}) {
	for _, c := range rooms[roomId] {
		if c.Username != sender {
			handleResponse(c.Conn, task, data, nil)
		}
	}
}

func RemoveRoomConnection(roomId int) {
	delete(rooms, roomId)
}
