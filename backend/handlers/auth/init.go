
package auth

import (
	"go.mongodb.org/mongo-driver/mongo"
)

var userCollection *mongo.Collection
var adminCollection *mongo.Collection

// InitCollections initializes the database collections for auth handlers
func InitCollections(db *mongo.Database) {
	userCollection = db.Collection("users")
	adminCollection = db.Collection("admins")
}
