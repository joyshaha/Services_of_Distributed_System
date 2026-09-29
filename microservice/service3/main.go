package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type SubtractRequest struct {
	A float64 `json:"a"`
	B float64 `json:"b"`
}

type SubtractResponse struct {
  A float64 `json:"a"`
  B float64 `json:"b"`
	Result float64 `json:"result"`
}

func subtractHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req SubtractRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	response := SubtractResponse{
    A: req.A,
    B: req.B,
		Result: req.A - req.B,
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"ok"}`))
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"message": "Go server is running Service3!"}`))
}

func main() {
  http.HandleFunc("/", rootHandler)
	http.HandleFunc("/health", healthHandler)
  http.HandleFunc("/subtract", subtractHandler)

	log.Println("Server running on :8080")

	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}