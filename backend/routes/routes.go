
package routes

import (
	"github.com/gin-gonic/gin"
)

// SetupAllRoutes initializes all routes - this is the function called from main.go
func SetupAllRoutes(r *gin.Engine) {
	SetupAuthRoutes(r)
	SetupUserRoutes(r)
	SetupListingRoutes(r)
	SetupOfferRoutes(r)
	SetupNotificationRoutes(r)
}

// Setup is an alias for backward compatibility
func Setup(r *gin.Engine) {
	SetupAllRoutes(r)
}
