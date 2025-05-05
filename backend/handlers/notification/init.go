
package notification

import (
	"context"
	"net/http"
	"time"

	"elsaidaliya/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var notificationCollection *mongo.Collection

// InitNotificationHandlers initializes handlers for notification management
func InitNotificationHandlers(db *mongo.Database) {
	notificationCollection = db.Collection("notifications")
}
