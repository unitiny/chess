<script setup lang="ts">
import {computed, defineEmits, onMounted, reactive, ref, watch} from "vue";
import * as common from "@/store/common"
import {
  CHESSBOARD,
  MACHINE_ACTION,
  MACHINE_NAME,
  MODEL_ATTRIBUTE,
  MODEL_DOUBLE_ATTRIBUTE,
  MSG_TYPE,
  USER_ACTION
} from "@/config";
import {MachineMsg, Message, Objects, Position} from "@/store/model";
import store from "@/store";
import Chat from "@/class/chat";
import {MENU_NAME} from "@/config";
import {API, ChessStep} from "@/api";
import {isJSON} from "@/store/common";

const emit = defineEmits(["start", "tryBack", "goBack", "choose", "moveChess", "attackTheChess", "machineStep"])

let model = ref(MODEL_ATTRIBUTE) // 新局面板
const modelAttribute = reactive({menu: false, start: false, chat: false, status: "11"}) // 新局面板属性
const tip = ref(computed(() => store.state.tip)) // 弹窗提示信息
const chat = reactive({
  messages: [] as Array<string>,
  isSelf: [] as Array<boolean>,
  editMsg: "",
}) // 聊天框所有属性
const mode = ref(store.state.mode) // 玩家选择模式

let WS = reactive(<Chat>connect()) // websocket交互器

// 显示配置窗
function show(model: string) {
  for (const key in modelAttribute) {
    if (typeof modelAttribute[key] === "boolean") {
      modelAttribute[key] = key === model ?
          !modelAttribute[key] : false
    }
  }
}

// 切换配置
function exchange(index: number) {
  if (isDoubleGame(mode.value)) {
    modelAttribute.status = common.reverseStatus(modelAttribute.status, "1")
  } else {
    let status = index === 0 ? "10" : "1"
    modelAttribute.status = common.reverseStatus(modelAttribute.status, status)
  }
}

// 确认配置，开始游戏
async function confirm() {
  if (WS !== null) {
    WS.close() // 关闭旧连接
  }

  store.commit("updateMode", mode.value)
  emit("start")
  show(MENU_NAME.START)

  if (isDoubleGame(mode.value)) {
    WS = reactive(<Chat>connect())
    let flag = await waitConnect()
    if (flag) {
      store.commit("updateTip", "对局开始")
    }
  } else {
    let msg: MachineMsg = {
      id: 0,
      action: MACHINE_ACTION.CLEAR,
      room: store.state.room,
      start: {} as Position,
      end: {} as Position
    }
    requestMachine(msg).then(() => {
      // 红方为人机
      if (common.isSameStatus(mode.value, "00", 1) ||
          common.isSameStatus(mode.value, "00")) {
        msg.action = MACHINE_ACTION.GO
        requestMachine(msg)
      }
    })
  }
}

// 发送消息
function sendMsg() {
  // console.log("sendMsg", chat.editMsg)
  if (!WS) {
    return
  }
  let msg: Message = {action: MSG_TYPE.CHAT, message: chat.editMsg}
  WS.sendMsg(msg)
  chat.editMsg = ""
}

// 发送棋迹
function sendStep(step: Objects) {
  // 翻转位置
  let path = JSON.parse(JSON.stringify(step))
  let {start, end} = path

  let reverseStart = [8 - start[0], 9 - start[1]]
  let reverseEnd = [8 - end[0], 9 - end[1]]
  path.start = reverseStart
  path.end = reverseEnd

  // 游戏模式决定发送模式
  if (isDoubleGame(mode.value)) {
    let msg: Message = {action: MSG_TYPE.CHESS, message: JSON.stringify(path)}
    WS.sendMsg(msg)
  }
}

// 发送给玩家指令
function sendAction(action: number) {
  let msg: Message = {action: action, message: ""}
  WS.sendMsg(msg)
}

// 发送给电脑指令
async function requestMachine(msg: MachineMsg) {
  await ChessStep(msg).then(res => {
    console.log("发送的msg:", msg)
    console.log("返回的数据：", res.data)
    if (res.data.data !== null && isJSON(res.data.data.toString())) {
      emit("machineStep", res.data.data)
    }
  })
}

// 悔棋
function back() {
  emit("tryBack")
}

// 返回主页
function home() {
  WS?.close()
  modelAttribute.status = "11"
  uni.navigateTo({
    url: "../index/index"
  })
}

// 获取提示位置
function getTipPos() {
  let x = CHESSBOARD.LT_POS[0] + CHESSBOARD.WIDTH / 2
  let y = CHESSBOARD.LT_POS[1] + CHESSBOARD.HEIGHT / 2
  console.log(x, y)
  return `left:${x}rpx;top:${y}rpx;`
}

// 连接房间
function connect(): Chat {
  let {name, room, mode} = store.state
  if (!isDoubleGame(mode)) {
    if (common.isSameStatus(mode, "11", 1)) {
      return null // 自定义双人模式不开启ws
    }
  }
  let url = `${API.chat}?name=${name}&room=${room}`
  return new Chat(url)
}

// 是否为双人对战
function isDoubleGame(mode: string): boolean {
  return common.hasStatus(mode, "10000")
}

// 等待连接成功
const waitConnect = async () => {
  if (WS !== null && WS.connected) {
    return true
  } else {
    await new Promise((resolve) => {
      setTimeout(resolve, 500)
    })
    return await waitConnect()
  }
}

watch(
    () => modelAttribute.status,
    () => {
      if (isDoubleGame(mode.value)) {
        if (common.hasStatus(modelAttribute.status, "1")) {
          model.value[0].span = "先手"
          mode.value = common.setStatus(mode.value, "1")
        } else {
          model.value[0].span = "后手"
          mode.value = common.resetStatus(mode.value, "1")
        }
      } else {
        // mode 默认111
        model.value[0].span = common.hasStatus(modelAttribute.status, "10") ? "棋手" : "电脑"
        model.value[1].span = common.hasStatus(modelAttribute.status, "1") ? "棋手" : "电脑"

        console.log(model.value)
        switch (modelAttribute.status) {
          case "0":
            // 红方电脑 黑方电脑
            mode.value = common.setStatus(mode.value, "1001")
            mode.value = common.resetStatus(mode.value, "110")
            break
          case "1":
            // 红方电脑 黑方棋手时改变棋局
            mode.value = common.setStatus(mode.value, "100")
            mode.value = common.resetStatus(mode.value, "11")
            break
          case "10":
            // 红方棋手 黑方电脑时改变对手身份
            mode.value = common.setStatus(mode.value, "100")
            mode.value = common.resetStatus(mode.value, "10")
            break
          case "11":
            // 红方棋手 黑方棋手
            mode.value = common.setStatus(mode.value, "111")
            break
        }
      }
    },
    {
      deep: true
    }
)

watch(
    () => store.state.receive,
    (val) => {
      // 未收到消息
      if (!val || WS === null) {
        return
      }

      console.log("watch", WS.message)

      switch (WS.message.action) {
        case 0:
          // 对手发送消息
          chat.messages.push(WS.message.message)
          WS.message.name === store.state.name ? chat.isSelf.push(true) : chat.isSelf.push(false)
          console.log(chat)
          break
        case 1:
          // 对手走出一步
          if (WS.message.name !== store.state.name && WS.message.name !== MACHINE_NAME) {
            console.log("opponent chess move")

            try {
              let step = JSON.parse(WS.message.message)
              let index = 31 - step.index // 由于初始棋子位置是镜像位置
              let pos = step.end
              if (step.action === USER_ACTION.MOVE_CHESS) {
                console.log(step.action, index, pos)
                emit("choose", index)
                emit("moveChess", index, pos)
              } else if (step.action === USER_ACTION.ATTACK_CHESS) {
                emit("choose", index)
                emit("attackTheChess", index, pos)
              }
            } catch (e) {
              console.log(e)
            }
          }
          break
        case 2:
          // 对手悔棋
          if (WS.message.name !== store.state.name) {
            emit("goBack")
          }
          break
      }

      WS.message = <Message>{} // 清空
      store.commit("updateReceive", false)
    }
)

onMounted(() => {
  // 初始化
  for (const name in MENU_NAME) {
    let key = MENU_NAME[name]
    modelAttribute[key] = false
  }

  // 改变面板
  if (isDoubleGame(mode.value)) {
    model.value = MODEL_DOUBLE_ATTRIBUTE
    modelAttribute.status = common.hasStatus(mode.value, "1") ? "1" : "0"
  } else {
    WS = null // 单机,关闭通讯
  }
})

defineExpose({sendStep, isDoubleGame, sendAction, requestMachine})

</script>

<template>
  <view class="content">

    <view class="edit">
      <image src="@/static/img/red-king.png" @tap="show(MENU_NAME.MENU)"></image>
      <view class="panel">
        <view @tap="show(MENU_NAME.START)">新局</view>
        <view @tap="show(MENU_NAME.CHAT)">聊天</view>
        <view @tap="back">悔棋</view>
      </view>
    </view>

    <view :class="{'mask': true, 'hidden': !modelAttribute.menu}">
      <view class="model">
        <view class="confirm" @tap="home">退出</view>
      </view>
    </view>

    <view :class="{'mask': true, 'hidden': !modelAttribute.start}">
      <view class="model">
        <view v-for="(item, index) in model" :key="index">
          <span>{{ item.text }}</span>
          <span class="block" @tap="exchange(index)">{{ item.span }}</span>
        </view>
        <view class="confirm" @tap="confirm">确定</view>
      </view>
    </view>

    <view :class="{'mask': true, 'hidden': !modelAttribute.chat}">
      <view class="model chat">
        <scroll-view scroll-y="true" class="scroll-Y">
          <view>
            <view v-for="(item, index) in chat.messages"
                  :class="{'message': true, 'self': chat.isSelf[index]}"
                  :key="index">
              {{ item }}
            </view>
          </view>
        </scroll-view>
        <view class="send">
          <input type="text" v-model:value="chat.editMsg">
          <span class="button" @tap="sendMsg">发送</span>
        </view>
      </view>
    </view>

    <view :class="{'tip': true, 'hidden': tip === ''}">{{ tip }}</view>

  </view>
</template>

<style scoped lang="scss">
.content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

.edit {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 20rpx 20rpx 5rpx 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  image {
    position: relative;
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    border: 4px solid #276c91;
    left: -30rpx;
  }

  .panel {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70%;

    view {
      margin: 20rpx auto;
      width: 30%;
      height: 100rpx;
      border-radius: 10rpx;
      text-align: center;
      line-height: 100rpx;
      font-size: 22px;
      font-weight: 600;
      font-family: cursive;
      color: #F9F9F9;
      background: #0A98D5;
    }
  }
}

.mask {
  position: absolute;
  width: 100%;
  height: 90%;
  top: 0;
  left: 0;
  z-index: 4;
}

.model {
  position: absolute;
  top: 240rpx;
  left: 15%;
  width: 70%;
  height: 500rpx;
  border-radius: 10rpx;
  background: #595959d9;
  padding-top: 60rpx;
  font-size: 22px;
  color: #FFFFFF;

  view {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: 20rpx 0 20rpx 0;

    .block {
      border-radius: 10rpx;
      background: #0A98D5;
      padding: 20rpx 80rpx 20rpx 80rpx;
    }
  }

  .confirm {
    width: 300rpx;
    margin: 40rpx auto;
    border-radius: 10rpx;
    background: #0A98D5;
    padding: 20rpx 0;
  }
}

.tip {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 26%;
  height: 90rpx;
  border-radius: 10rpx;
  background: rgba(89, 89, 89, 0.85);
  font-size: 20px;
  color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;
}

.chat {
  padding-top: 0;
  height: 700rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  scroll-view {
    height: 60%;

    view {
      display: flex;
      align-items: center;
      flex-direction: column;

      .message {
        width: 80%;
        margin: 0 auto;
        border-bottom: 1px solid #dedede;
        padding: 20rpx;
      }

      .self {
        color: #2ec778;
      }
    }
  }

  .send {
    position: relative;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    bottom: -60rpx;
    padding: 20rpx;

    input {
      width: 60%;
      height: 65rpx;
      border-radius: 10rpx;
      border: 1px solid #d9d6d6;
      background: #484848;
    }
  }
}

.button {
  font-size: 22px;
  color: #FFFFFF;
  border-radius: 10rpx;
  background: #0A98D5;
  padding: 10rpx;
}

.hidden {
  display: none;
  pointer-events: none;
}
</style>
