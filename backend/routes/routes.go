
package routes

import (
	"github.com/gin-gonic/gin"
)

// SetupAllRoutes configures all application routes
func SetupAllRoutes(r *gin.Engine) {
	SetupUserRoutes(r)
	SetupAuthRoutes(r)
	SetupListingRoutes(r)
	SetupOfferRoutes(r)
}
