package controllers

import (
	"github.com/astaxie/beego"
)

type MainController struct {
	beego.Controller
}

func (this *MainController) Welcome() {
	this.TplName = "welcome.html"
}
func (this *MainController) ChatRoom() {
	this.TplName = "chatroom.html"
}

func (this *MainController) Join() {
	name:=this.GetString("name")
	this.SetSession("name",name)
}

func (this *MainController) GetName(){
	this.Data["name"] = this.GetString("name")
	this.ServeJSON()
}

func (this *MainController)WS()  {

}