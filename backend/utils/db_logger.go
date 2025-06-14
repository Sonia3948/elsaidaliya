
package utils

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/event"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// DBLogger provides logging for MongoDB operations
type DBLogger struct{}

// NewDBLogger creates a new database logger
func NewDBLogger() *DBLogger {
	return &DBLogger{}
}

// GetMonitorOptions returns MongoDB client options with command monitoring
func (l *DBLogger) GetMonitorOptions() *options.ClientOptions {
	cmdMonitor := &event.CommandMonitor{
		Started: func(_ context.Context, evt *event.CommandStartedEvent) {
			log.Printf("[DB] Command Started - RequestID: %d, Database: %s, Command: %s, Query: %v", 
				evt.RequestID, evt.DatabaseName, evt.CommandName, evt.Command)
		},
		Succeeded: func(_ context.Context, evt *event.CommandSucceededEvent) {
			log.Printf("[DB] Command Succeeded - RequestID: %d, Duration: %v", 
				evt.RequestID, evt.Duration)
		},
		Failed: func(_ context.Context, evt *event.CommandFailedEvent) {
			log.Printf("[DB] Command Failed - RequestID: %d, Duration: %v, Error: %v", 
				evt.RequestID, evt.Duration, evt.Failure)
		},
	}

	clientOptions := options.Client()
	clientOptions.SetMonitor(cmdMonitor)
	
	return clientOptions
}
