import {createStore} from "vuex";
import {randString} from "@/store/common";

const store = createStore({
    state: {
        ratio: 0, // rpx/px比率
        name: "111", // 唯一用户名
        room: "abc", // 房间号
        mode: "0", // MODE_STATUS
        receive: false, // 是否收到消息
        tip: "",
    },

    mutations: {
        updateRatio(state, val) {
            state.ratio = val
        },
        updateTip(state, val) {
            state.tip = val
        },
        updateMode(state, val) {
            state.mode = val
        },
        updateRoom(state, val) {
            state.room = val
        },
        updateReceive(state, val) {
            state.receive = val
        },
        updateName(state, val) {
            state.name = val
        }
    }
})

export default store