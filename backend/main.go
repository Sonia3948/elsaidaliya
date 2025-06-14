
package main

import (
	"log"

	"elsaidaliya/config"
	"elsaidaliya/database"
	"elsaidaliya/handlers"
	"elsaidaliya/middleware"
	"elsaidaliya/routes"
	"elsaidaliya/server"
)

func main() {
	// Load configuration
	cfg := config.Load()
	log.Printf("Starting server with config: Port=%s, MongoDB URI configured", cfg.Port)
	
	// Connect to database
	client, database, err := database.Connect(cfg.MongoURI)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer client.Disconnect(nil)
	
	log.Println("Database connected successfully")
	
	// Initialize handlers with database connection
	handlers.InitAllHandlers(database)
	log.Println("Handlers initialized")
	
	// Initialize middleware
	middleware.InitAuthMiddleware(database)
	log.Println("Middleware initialized")
	
	// Create and configure server
	srv := server.New(database)
	log.Println("Server created")
	
	// Set up routes
	srv.SetupBasicRoutes()
	routes.SetupAllRoutes(srv.Router())
	log.Println("Routes configured")
	
	// Start the server
	log.Printf("Starting server on port %s...", cfg.Port)
	log.Fatal(srv.Start(cfg.Port))
}
