
package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Connect establishes a connection to MongoDB
func Connect(mongoURI string) (*mongo.Client, *mongo.Database, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	
	// Connect to MongoDB
	clientOptions := options.Client().ApplyURI(mongoURI)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, nil, err
	}
	
	// Verify the connection
	err = client.Ping(ctx, nil)
	if err != nil {
		return nil, nil, err
	}
	
	log.Println("Connected to MongoDB!")
	
	// Initialize database
	database := client.Database("elsaidaliya")
	
	return client, database, nil
}
