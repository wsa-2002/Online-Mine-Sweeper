package service

type CheckStatusInput struct {
	RoomNumber int `json:"room_number"`
}

type CheckStatusOutput struct {
	Status   string      `json:"status"`
	Winner   string      `json:"winner"`
	Turns    string      `json:"turns"`
	TimeLeft interface{} `json:"time_left"`
}

func CheckStatus(username string, data CheckStatusInput) (*CheckStatusOutput, error) {
	return nil, nil
}
