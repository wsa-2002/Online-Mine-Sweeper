package service

type ActionInput struct {
	RoomNumber int    `json:"room_number"`
	ActionType string `json:"action_type"`
	X          int    `json:"x"`
	Y          int    `json:"y"`
}

type ActionOutput struct {
	Status   string      `json:"status"`
	Winner   string      `json:"winner"`
	Turns    string      `json:"turns"`
	TimeLeft interface{} `json:"time_left"`
	Board    [][]int     `json:"board"`
}

func HandleAction(username string, data ActionInput) (*ActionOutput, error) {
	return nil, nil
}
