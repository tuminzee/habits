package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Environment    string
	ClerkSecretKey string
	FrontendURL    string
	Port           string
}

func Load() (*Config, error) {
	env := os.Getenv("GO_ENV")
	if env == "" {
		return nil, fmt.Errorf("GO_ENV environment variable is required (development/production)")
	}

	if env == "development" {
		godotenv.Load(".env.local")
	}

	if env == "production" {
		godotenv.Load()
	}

	config := &Config{
		Environment:    os.Getenv("GO_ENV"),
		ClerkSecretKey: os.Getenv("CLERK_SECRET_KEY"),
		FrontendURL:    os.Getenv("FRONTEND_URL"),
		Port:           os.Getenv("PORT"),
	}

	if err := config.Validate(); err != nil {
		return nil, fmt.Errorf("environment validation failed: %w", err)
	}

	return config, nil
}

func (c *Config) Validate() error {
	required := map[string]string{
		"GO_ENV":           c.Environment,
		"CLERK_SECRET_KEY": c.ClerkSecretKey,
		"FRONTEND_URL":     c.FrontendURL,
	}

	var missingVars []string
	for name, value := range required {
		if value == "" {
			missingVars = append(missingVars, name)
		}
	}

	if len(missingVars) > 0 {
		return fmt.Errorf("missing required environment variables: %v", missingVars)
	}

	return nil
}
