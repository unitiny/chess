import axios from "axios";

// const httpRoot = "/local"
// const httpRoot = "https://chat-chat-eerndkjruc.cn-hangzhou.fcapp.run"
// const httpRoot = "https://chess-back-production-ad86.up.railway.app"
const httpRoot = "https://chess-back.zeabur.app"
const proxyRoot = "zeabur"

// const hostName = window.document.location.hostname
// const wsRoot = `ws://${hostName}:9000`

// const wsRoot = "wss://chat-chat-eerndkjruc.cn-hangzhou.fcapp.run"
// const wsRoot = "wss://chess-back-production-ad86.up.railway.app"
const wsRoot = "https://chess-back.zeabur.app"

const API = {
    chat: wsRoot + "/joinRoom",
    haveRoom: "/haveRoom",
    leaveRoom: "/leaveRoom",
    chess: "/chess"
}

// 注意 参数data是用于post请求的
const Axios = axios.create({
    baseURL: proxyRoot,
    timeout: 1000 * 20,
})

// // 添加请求拦截器
// Axios.interceptors.request.use(
//     function (config){
//         console.log(config)
//         // 请求之前动作
//         return config
//     },
//
//     function (err) {
//         // 请求失败动作
//         console.log(err)
//         return Promise.reject(err)
//     }
// )
//
// // 添加响应拦截器
// Axios.interceptors.response.use(
//     function (res){
//         console.log(res)
//         return res.data
//     },
//     function (err) {
//         console.log(err)
//         return Promise.reject(err)
//     }
// )

const HaveRoom = function (params: Object) {
    return Axios({
        url: API.haveRoom,
        method: "get",
        params: params
    })
}

const LeaveRoom = function (params: Object) {
    return Axios({
        url: API.leaveRoom,
        method: "get",
        params: params
    })
}

const ChessStep = function (params: Object) {
    return Axios({
        url: API.chess,
        method: "post",
        data: params
    })
}


export {
    API,
    HaveRoom, LeaveRoom,
    ChessStep,
}

