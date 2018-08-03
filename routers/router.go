package routers

import (
	"go-chat/controllers"
	"github.com/astaxie/beego"
)

func init() {
	//page
    beego.Router("/welcome", &controllers.MainController{},"get:Welcome")
    beego.Router("/chatroom", &controllers.MainController{},"GET:ChatRoom")
    //controller
    beego.Router("/join", &controllers.MainController{},"POST:Join")
    beego.Router("/name", &controllers.MainController{},"GET:GetName")
	// WebSocket.
	beego.Router("/ws", &controllers.MainController{},"*:WS")
}
