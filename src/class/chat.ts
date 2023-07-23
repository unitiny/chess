import type {Message, Objects} from "@/store/model";
import {isJSON, hasStatus} from "@/store/common";
import {MACHINE_NAME, MSG_TYPE} from "@/config";
import store from "@/store";

class Chat {
    url: string
    ws: WebSocket
    message: Message
    connected: boolean

    constructor(url: string) {
        this.url = url
        this.message = {action: MSG_TYPE.NOT_ACTION, message: ""}
        this.init()
    }

    init() {
        // 是双人模式才开启
        if(!hasStatus(store.state.mode, "10000")) {
            return
        }
        this.ws = new WebSocket(this.url)

        this.ws.onopen = e => {
            //当WebSocket创建成功时，触发onopen事件
            console.log("open");
            this.connected = true
        }

        this.ws.onmessage = e => {
            // console.log("onmessage", e)
            this.handlerMsg(e.data)
        }

        this.ws.onerror = e => {
            console.log("error", e)
            this.connected = false
        }

        this.ws.onclose = e => {
            console.log("onclose", e)
            this.connected = false
            // this.init() // 断线重连
        }
    }

    close() {
        this.ws.close()
    }

    handlerMsg(msg: string) {
        let data = JSON.parse(msg)

        if (isJSON(data.content)) {
            this.message = <Message>{}
            this.message = JSON.parse(data.content)
        }
        store.commit("updateReceive", true)
    }

    sendMsg(msg: Message, name?: string) {
        if (!this.ws) {
            return
        }
        msg.name = name ? name : store.state.name
        console.log("sendMsg", msg)
        let str = JSON.stringify(msg)
        this.ws.send(str)
    }

    sendMachineMsg(msg: Objects) {
        console.log("sendMachineMsg", msg)
        let str = JSON.stringify(msg)
        this.ws.send(str)
    }
}

export default Chat