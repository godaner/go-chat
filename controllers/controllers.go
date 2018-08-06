package controllers

import (
	"github.com/astaxie/beego"
	"github.com/gorilla/websocket"
	"encoding/json"
	"container/list"
)
type M map[string]interface{}
type MainController struct {
	beego.Controller
}

const (
	VIEWS_WELCOME =  "welcome.html"
	VIEWS_CHAT_ROOM =  "chatroom.html"
)
func (this *MainController) Welcome() {
	this.TplName = VIEWS_WELCOME
}

func (this *MainController) Join() {
	name:=this.GetString("name")


	for sub:=subscribers.Front();sub!=nil;sub = sub.Next(){
		if sub.Value.(Subscriber).Name == name {
			this.TplName = VIEWS_WELCOME
			beego.Info("MainController Join name is exist : ",name)
			return
		}
	}

	beego.Info("MainController Join session name is : ",name)

	this.SetSession("name",name)
	this.TplName = VIEWS_CHAT_ROOM
}

func (this *MainController) GetName(){
	sessionName:=this.GetSession("name")
	beego.Info("MainController GetName session name is : ",sessionName)
	this.Data["json"] = M{"name": sessionName}
	this.ServeJSON()
}


type Subscriber struct {
	Name string
	Conn *websocket.Conn
}

type Messager struct {
	Name string
	Context string
	Type int
}

const (
	MSG=1
	OFFLINE=2
	ONLINE=3
)

var (
	subscribe = make(chan Subscriber)

	unsubscribe = make(chan string)

	message = make(chan Messager)

	subscribers = list.New()
)

func (this *MainController)WS()  {

	name:=this.GetString("name")

	conn:=createWS(this)

	subscribe<-Subscriber{
		Name:name,
		Conn:conn,
	}
	defer LeaveWS(name)

	// Message receive loop.
	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			return
		}
		message <- Messager{
			Name:name,
			Context:string(p),
			Type:MSG,
		}
	}
}
func LeaveWS(name string) {
	unsubscribe<-name
}



func broadcast(messager Messager) {
	data, err := json.Marshal(messager)
	if err != nil {
		beego.Error("Fail to marshal event:", err)
		return
	}

	for sub := subscribers.Front(); sub != nil; sub = sub.Next() {
		// Immediately send event to WebSocket users.
		ws := sub.Value.(Subscriber).Conn
		if ws != nil {
			ws.WriteMessage(websocket.TextMessage, data)
			//if ws.WriteMessage(websocket.TextMessage, data) != nil {
			//	User disconnected.
				//unsubscribe <- sub.Value.(Subscriber).Name
			//}
		}
	}


}

func handleChannel(){

	go func() {
		for   {
			sub :=<-subscribe

			beego.Info("controllers handleChannel select subscribe ")
			message<-Messager{
				Name:sub.Name,
				Context:"上线",
				Type:ONLINE,
			}

			subscribers.PushBack(sub)
		}
	}()


	go func() {
		for   {
			unSubName:=<-unsubscribe
			beego.Info("controllers handleChannel select unsubscribe ")

			for sub:=subscribers.Front();sub!=nil;sub = sub.Next(){
				if sub.Value.(Subscriber).Name == unSubName {
					subscribers.Remove(sub)
					break
				}
			}
			message<-Messager{
				Name:unSubName,
				Context:"下线",
				Type:OFFLINE,
			}
		}
	}()



	go func() {
		for   {
			msg:=<-message
			beego.Info("controllers handleChannel select message ")
			broadcast(msg)
		}
	}()


}
func init() {
	beego.Info("controllers init !")
	go handleChannel()
}

func createWS(this *MainController) *websocket.Conn {
	// Upgrade from http request to WebSocket.
	ws, _ := websocket.Upgrade(this.Ctx.ResponseWriter, this.Ctx.Request, nil, 1024, 1024)
	return ws
}