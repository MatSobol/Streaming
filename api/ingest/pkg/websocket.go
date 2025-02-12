package pkg

import (
	"net/http"
    "fmt"
	"strings"
    "github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func WsHandler(w http.ResponseWriter, r *http.Request, portList *PortList) {
    conn, err := upgrader.Upgrade(w, r, nil)
	fmt.Println("Connection")
    if err != nil {
		fmt.Println("Error upgrading:", err)
		panic(err)
    }
    defer conn.Close()
	_, message, err := conn.ReadMessage()

	if err != nil {
		fmt.Println("Error reading message:", err)
		panic(err)
	}

	initMessage := strings.SplitN(string(message), ":", 2)

	if initMessage[0] == "init" {
		fmt.Println("Init")
		Connect(conn, portList, initMessage[1])
	}
}
