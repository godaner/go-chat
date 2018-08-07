package routers

import (
	"go-chat/controllers"
	"github.com/astaxie/beego"
)

func init() {
	//static
    beego.Router("/", &controllers.MainController{},"GET:Welcome")
    beego.Router("/chatroom", &controllers.MainController{},"GET:Chatroom")
    //controller
    beego.Router("/join", &controllers.MainController{},"POST:Join")
    beego.Router("/checkName", &controllers.MainController{},"POST:CheckName")
	//WebSocket.
	beego.Router("/ws", &controllers.MainController{},"*:WS")
}
