package models

type M map[string]interface{}

const (
	SUCCESS = 1
	FAILURE = 2
)


type Response struct {
	Code uint8	`json:"code"`
	Msg string	`json:"msg"`
	Data M	`json:"data"`
}