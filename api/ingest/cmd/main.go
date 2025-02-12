package main

import (
	"net/http"
	"fmt"
	"ingest/pkg"
)

func main() {
    
    ports := make([]pkg.Port, 200)
    
    for i := 0; i < 200; i ++ {
        ports[i] = pkg.Port{Val: pkg.StartingUdpPort + i * 4, IsUsed: false}
    }

    portList := pkg.PortList{Ports: ports}

    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		pkg.WsHandler(w, r, &portList)
	})
    fmt.Println("WebSocket server started on :4000")
	err := http.ListenAndServe(":4000", nil)
    if err != nil {
       fmt.Println("Error starting server:", err)
    }
}
