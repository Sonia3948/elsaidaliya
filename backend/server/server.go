
package server

import (
	"log"
	"net/http"
	"os"
	"time"

	"elsaidaliya/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

// Server represents the HTTP server and its dependencies
type Server struct {
	router   *gin.Engine
	database *mongo.Database
}

// New creates and configures a new server instance
func New(database *mongo.Database) *Server {
	// Configure gin router
	r := gin.Default()

	// Add request logging middleware
	r.Use(middleware.RequestLogger())

	// Get frontend URL from environment
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:5173"
	}

	// Configure CORS with multiple allowed origins
	allowedOrigins := []string{
		frontendURL,
		"http://localhost:5173",
		"http://localhost:8080",
		"https://id-preview--ea9bef20-e4c1-40e2-be12-a22bd2bb3083.lovable.app",
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	return &Server{
		router:   r,
		database: database,
	}
}

// Start begins listening for HTTP requests
func (s *Server) Start(port string) error {
	log.Printf("Server started on port %s", port)
	return s.router.Run(":" + port)
}

// Router returns the Gin router instance to configure routes
func (s *Server) Router() *gin.Engine {
	return s.router
}

// Database returns the MongoDB database instance
func (s *Server) Database() *mongo.Database {
	return s.database
}

// SetupBasicRoutes configures basic API routes
func (s *Server) SetupBasicRoutes() {
	s.router.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "El Saidaliya API is running",
		})
	})
}
