FROM golang:1.22.4-alpine AS builder

WORKDIR /app

# Download Go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy the entire source code directory
COPY . .

# Build - adjust the path to your main.go file
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/main ./cmd/

# Run
CMD ["/app/main"]