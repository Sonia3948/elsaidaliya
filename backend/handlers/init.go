
package handlers

import (
	"go.mongodb.org/mongo-driver/mongo"
)

// InitAllHandlers initializes all handlers with database connection
func InitAllHandlers(db *mongo.Database) {
	InitAuthHandlers(db)
	InitUserHandlers(db)
	InitListingHandlers(db)
	InitOfferHandlers(db)
}
