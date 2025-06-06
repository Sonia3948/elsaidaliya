
package database

import (
	"context"
	"log"
	"time"

	"elsaidaliya/utils"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Connect establishes a connection to MongoDB with query logging
func Connect(mongoURI string) (*mongo.Client, *mongo.Database, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	
	// Initialize database logger
	dbLogger := utils.NewDBLogger()
	
	// Connect to MongoDB with updated options for Atlas and logging
	clientOptions := options.Client().ApplyURI(mongoURI)
	clientOptions.SetMaxPoolSize(100)
	clientOptions.SetMinPoolSize(5)
	clientOptions.SetRetryWrites(true)
	
	// Add command monitoring for query logging
	loggerOptions := dbLogger.GetMonitorOptions()
	clientOptions.SetMonitor(loggerOptions.Monitor)
	
	log.Println("Connecting to MongoDB Atlas with query logging enabled...")
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Printf("Error connecting to MongoDB: %v", err)
		return nil, nil, err
	}
	
	// Verify the connection
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Printf("Error pinging MongoDB: %v", err)
		return nil, nil, err
	}
	
	log.Println("Successfully connected to MongoDB Atlas with query logging!")
	
	// Extract database name from the connection string or use default
	dbName := "elsaidaliya"
	
	// Initialize database
	database := client.Database(dbName)
	
	return client, database, nil
}
