
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
	
	// Connect to database
	client, database, err := database.Connect(cfg.MongoURI)
	if err != nil {
		log.Fatal(err)
	}
	
	// Initialize handlers with database connection
	handlers.InitAllHandlers(database)
	
	// Initialize middleware
	middleware.InitAuthMiddleware(database)
	
	// Create and configure server
	srv := server.New(database)
	
	// Set up routes
	srv.SetupBasicRoutes()
	routes.SetupAllRoutes(srv.Router())
	
	// Start the server
	log.Fatal(srv.Start(cfg.Port))
}
