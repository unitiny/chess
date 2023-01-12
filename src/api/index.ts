import axios from "axios";

const httpRoot = "/local"
// const httpRoot = "https://chat-chat-eerndkjruc.cn-hangzhou.fcapp.run"

const hostName = window.document.location.hostname
const wsRoot = `ws://${hostName}:9000/`

// const wsRoot = "wss://chat-chat-eerndkjruc.cn-hangzhou.fcapp.run"

const API = {
    chat: wsRoot,
    haveRoom: "/haveRoom",
    leaveRoom: "/leaveRoom",
    chess: "/chess"
}

// 注意 参数data是用于post请求的
const Axios = axios.create({
    baseURL: httpRoot,
    timeout: 5000,
})

// // 添加请求拦截器
Axios.interceptors.request.use(
    function (config){
        console.log(config)
        // 请求之前动作
        return config
    },

    function (err) {
        // 请求失败动作
        console.log(err)
        return Promise.reject(err)
    }
)
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

const HaveRoom = function (params) {
    return Axios({
        url: API.haveRoom,
        method: "get",
        params: params
    })
}

const LeaveRoom = function (params) {
    return Axios({
        url: API.leaveRoom,
        method: "get",
        params: params
    })
}

const ChessStep = function (params) {
    return Axios({
        url: API.chess,
        method: "get",
        params: params
    })
}

export {
    API,
    HaveRoom, LeaveRoom,
    ChessStep
}

