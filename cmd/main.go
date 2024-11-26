package main

import (
	"log"
	"net/http"
	"os"

	"github.com/clerk/clerk-sdk-go/v2"
	clerkhttp "github.com/clerk/clerk-sdk-go/v2/http"
	"github.com/clerk/clerk-sdk-go/v2/user"
	"github.com/joho/godotenv"
)

func main() {

	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file:", err)
	}

	log.Println("Initializing server...")
	clerk.SetKey(os.Getenv("CLERK_SECRET_KEY"))

	mux := http.NewServeMux()
	mux.Handle("/hello", clerkhttp.WithHeaderAuthorization()(hello()))
	log.Println("Routes configured, starting server on port 8080...")

	err := http.ListenAndServe(":8080", mux)
	if err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func hello() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Received request from %s: %s %s", r.RemoteAddr, r.Method, r.URL.Path)

		ctx := r.Context()
		claims, ok := clerk.SessionClaimsFromContext(ctx)
		if !ok {
			log.Printf("Unauthorized access attempt from %s", r.RemoteAddr)
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"access": "unauthorized"}`))
			return
		}
		log.Printf("Authenticated user with ID: %s", claims.Subject)

		usr, err := user.Get(ctx, claims.Subject)
		if err != nil {
			log.Printf("Error fetching user data: %v", err)
			panic(err)
		}
		if usr == nil {
			log.Printf("User not found: %s", claims.Subject)
			w.Write([]byte("User does not exist"))
			return
		}

		log.Printf("Successfully retrieved user: %s %s", *usr.FirstName, *usr.LastName)
		w.Write([]byte("Hello " + *usr.FirstName))
	}
}
