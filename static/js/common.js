
const SUCCESS = 1;
const FAILURE = 2;

const KEY_OF_NAME = "name";

function toHome() {
    location.href = "http://" + window.location.host;
}

function toChatRoom() {
    location.href = "http://" + window.location.host+"/chatroom";
}
