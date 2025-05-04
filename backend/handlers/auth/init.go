
package auth

import (
	"context"
	"log"
	"time"

	"elsaidaliya/models"
	
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var adminCollection *mongo.Collection
var userCollection *mongo.Collection

// InitCollections initializes the collections for auth handlers
func InitCollections(db *mongo.Database) {
	adminCollection = db.Collection("admins")
	userCollection = db.Collection("users")
	
	// Create the admin user if it doesn't exist
	createAdminUser()
}

// Create admin user if it doesn't exist
func createAdminUser() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	
	// Check if admin exists
	var existingAdmin models.AdminUser
	err := adminCollection.FindOne(ctx, bson.M{"phone": "0549050018"}).Decode(&existingAdmin)
	
	if err == mongo.ErrNoDocuments {
		// Admin doesn't exist, create it
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte("Ned@0820"), bcrypt.DefaultCost)
		if err != nil {
			log.Printf("Error hashing admin password: %v", err)
			return
		}
		
		admin := models.AdminUser{
			ID:        primitive.NewObjectID(),
			Phone:     "0549050018",
			Password:  string(hashedPassword),
			CreatedAt: time.Now(),
		}
		
		_, err = adminCollection.InsertOne(ctx, admin)
		if err != nil {
			log.Printf("Error creating admin user: %v", err)
			return
		}
		
		log.Println("Admin user created successfully")
	} else if err != nil {
		log.Printf("Error checking for admin user: %v", err)
	} else {
		log.Println("Admin user already exists")
	}
}
