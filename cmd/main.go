package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"runtime"
	"time"

	"github.com/clerk/clerk-sdk-go/v2"
	clerkhttp "github.com/clerk/clerk-sdk-go/v2/http"
	"github.com/clerk/clerk-sdk-go/v2/user"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/tuminzee/habits/internal/config"
)

type User struct {
	Username string `json:"username"`
}

type UserResponse struct {
	Users []*User `json:"users"`
	Total int     `json:"total"`
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Call the next handler
		next.ServeHTTP(w, r)

		// Log the request details after it's processed
		duration := time.Since(start)
		log.Printf("%s %s %s %v", r.Method, r.RequestURI, r.RemoteAddr, duration)
	})
}

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	log.Printf("Running in %s environment, go version: %s, frontend URL: %s", cfg.Environment, runtime.Version(), cfg.FrontendURL)

	clerk.SetKey(cfg.ClerkSecretKey)

	router := mux.NewRouter()

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{cfg.FrontendURL, "http://localhost:5173"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		Debug:            true,
	})

	handler := loggingMiddleware(c.Handler(router))
	router.Handle("/me", clerkhttp.WithHeaderAuthorization()(http.HandlerFunc(meRoute))).Methods("GET")
	router.Handle("/users", clerkhttp.WithHeaderAuthorization()(http.HandlerFunc(userRoute))).Methods("GET")

	log.Printf("Server starting on port %s", cfg.Port)
	if err := http.ListenAndServe(fmt.Sprintf(":%s", cfg.Port), handler); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}

func userRoute(w http.ResponseWriter, r *http.Request) {
	limit := int64(10)
	users, err := user.List(r.Context(), &user.ListParams{
		ListParams: clerk.ListParams{
			Limit: &limit,
		},
	})
	if err != nil {
		panic(err)
	}

	usersResponse := UserResponse{
		Users: make([]*User, len(users.Users)),
	}
	usersResponse.Total = int(users.TotalCount)
	for i, u := range users.Users {
		usersResponse.Users[i] = &User{Username: *u.Username}
	}

	json.NewEncoder(w).Encode(usersResponse)
}

func meRoute(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	claims, ok := clerk.SessionClaimsFromContext(ctx)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"access": "unauthorized"}`))
		return
	}

	usr, err := user.Get(ctx, claims.Subject)
	if err != nil {
		panic(err)
	}
	if usr == nil {
		w.Write([]byte("User does not exist"))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(User{
		Username: *usr.Username,
	})
}
