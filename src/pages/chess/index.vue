<script setup lang="ts">
import Chess from "@/class/chess";
import ChessBoard from "@/class/chessBoard";
import {
  CHESS_ATTRIBUTES,
  CHESSBOARD,
  USER_ACTION,
  TIP_MSG,
  CHESS,
  MSG_TYPE,
  MACHINE_ACTION
} from "@/config";
import {Objects} from "@/store/model";
import * as common from "@/store/common"
import * as moves from "@/store/moves"
import Edit from "./edit.vue";
import Audio from "./audio.vue";
import store from "@/store";
import {isSameStatus} from "@/store/common";
import {onMounted, ref, reactive, watch, computed} from "vue";


const refContent = ref(null) // 内容节点
const refEdit = ref(null) // 编辑节点
const refAudio = ref(null) // 音频节点
const refBoard = ref(null) // 棋盘节点

const chesses = ref([])// 棋子属性
const curIndex = ref(0)// 当前棋子索引
const curCamp = ref(2)// 当前轮到阵营 0 黑色  1 红色
const record = reactive([]) // 记录棋局
const mode = ref(computed(() => store.state.mode)) // 玩家选择模式
const close = ref(false) // 关闭棋局
const chessBoard = reactive(new ChessBoard()) // 棋盘

// 动态计算位置
function getDistance() {
  // 获取rpx/px 比率
  let ratio = 750 / refContent.value.$el.offsetWidth
  store.commit("updateRatio", ratio)
  // 5、10是去除边框影响
  let el = refBoard.value.$el
  CHESSBOARD.LT_POS = [(el.offsetLeft + 5) * ratio, (el.offsetTop + 10) * ratio]
  CHESSBOARD.WIDTH = (el.offsetWidth - 10) * ratio / 8
  CHESSBOARD.HEIGHT = (el.offsetHeight - 20) * ratio / 9

  CHESS.WIDTH = CHESSBOARD.WIDTH
  CHESS.HEIGHT = CHESSBOARD.HEIGHT
}

// 重置棋局
function resetGame(camp: number) {
  curCamp.value = 1

  // 己方选择黑方
  if (camp === 1) {
    init()
    return
  }

  // 己方选择黑方
  // 修改地盘
  let num = CHESSBOARD.RED_BOTTOM
  CHESSBOARD.RED_BOTTOM = CHESSBOARD.BLACK_BOTTOM
  CHESSBOARD.BLACK_BOTTOM = num

  // 初始化
  init()

  // 阵营取反
  for (let i = 0; i < chesses.value.length; i++) {
    chesses.value[i].status = common.reverseStatus(chesses.value[i].status, "1")
  }
}

// 棋子初始化
function init() {
  chesses.value.length = 0
  for (let i = 0; i < CHESS_ATTRIBUTES.length; i++) {
    let obj = CHESS_ATTRIBUTES[i] as Objects
    chesses.value.push(new Chess(obj.x, obj.y, obj.name, obj.camp))
  }
}

// 根据配置开局
function start() {
  console.log("mode", mode.value)
  if (common.isSameStatus(mode.value, "00", 1)) {
    // 两人机
    console.log("两人机")
    resetGame(1)
  } else if (refEdit.value.isDoubleGame(mode.value)) {
    // 双人
    common.hasStatus(mode.value, "1") ? resetGame(1) : resetGame(0)
  } else if (isSameStatus(mode.value, "11", 1)) {
    // 自定义非两人机
    common.hasStatus(mode.value, "1") ? resetGame(1) : resetGame(0)
  } else {
    // 玩家和人机
    console.log("玩家和人机")
    common.hasStatus(mode.value, "1") ? resetGame(1) : resetGame(0)
  }

  close.value = false
}

// 控制器
function Controller(e) {
  if (close.value) {
    return
  }

  let pos = chessBoard.getPos(e)
  let cmd = action(pos)
  let index = getChessByPos(pos)
  console.log(pos, cmd, index);

  try {
    switch (cmd) {
      case USER_ACTION.CHOOSE_CHESS:
        canChoose(curCamp.value)
        choose(index)
        break
      case USER_ACTION.MOVE_CHESS:
        moveChess(curIndex.value, pos)
        break
      case USER_ACTION.ATTACK_CHESS:
        attackTheChess(curIndex.value, pos)
        break
    }
  } catch (e) {
    console.log(e)
  }
}

// 能否选择棋子
function canChoose(camp: number) {
  if (!common.isSameStatus(mode.value, camp.toString())) {
    if (refEdit.value.isDoubleGame(mode.value)) {
      throw new Error("不能选择对方阵营棋子") // 双人不能选择对方阵营棋子
    } else if (!refEdit.value.isDoubleGame(mode.value) && !common.hasStatus(mode.value, "10")) {
      // throw new Error("不能选择人机阵营棋子") // 人机对战不能选择人机棋子
    }
  }
}

// 移动棋子
function moveChess(index, pos: Array<number>) {
  changePos(index, pos)
  changeCamp()
  changeBox()
  checkmate()
}

// 攻击棋子
function attackTheChess(index, pos: Array<number>) {
  attackChess(index, pos)
  changeCamp()
  changeBox()
  checkmate()
}

// 记录位置,用于悔棋及发送信息
function recordPos(index: number, pos: Array<number>) {
  let chess = chesses.value[index]
  let action = common.hasStatus(chess.status, "1000") ? USER_ACTION.ATTACK_CHESS : USER_ACTION.MOVE_CHESS
  let step = {
    index: chess.id,
    start: pos,
    end: [chess.x, chess.y],
    action: action,
    camp: chess.camp,
    room: store.state.room
  }
  record.push(step)

  // 发送给对手走的路线
  let selfCamp = mode.value[mode.value.length - 1]
  if (store.state.tip !== TIP_MSG.KILLED_KING) {
    if (common.isSameStatus(mode.value, "00", 1)) {
      // 两人机
      refEdit.value.sendMachineAction(MACHINE_ACTION.BACK)
      refEdit.value.sendStep(step)
    } else if (common.isSameStatus(chess.status, selfCamp)) {
      // 玩家走了一步棋才发送
      refEdit.value.sendStep(step)
    }
  }
}

// 悔棋过滤器
function tryBack() {
  // 双人则发送给对方悔棋指令
  if (refEdit.value.isDoubleGame(mode.value)) {
    if (!common.isSameStatus(mode.value, curCamp.value.toString())) {
      refEdit.value.sendAction(MSG_TYPE.BACK)
      goBack()
    } else {
      store.commit("updateTip", TIP_MSG.NOT_BACK)
      return
    }
  } else if (common.isSameStatus(mode.value, "10", 1)) { // 对方为人机
    refEdit.value.sendMachineAction(MACHINE_ACTION.BACK)
    goBack()
  }
}

// 悔棋
function goBack() {
  let len = record.length
  if (len === 0) {
    return
  }

  let step = record[len - 1]
  record.splice(len - 1, 1)

  // 被吃棋子复活
  if (step.eat) {
    chesses.value[step.eat].status = common.setStatus(chesses.value[step.eat].status, "10")
  }

  curIndex.value = step.index
  // 悔棋且选中状态
  chesses.value[curIndex.value].status = common.setStatus(chesses.value[curIndex.value].status, "10100")

  changePos(curIndex.value, step.start)

  chesses.value[curIndex.value].status = common.resetStatus(chesses.value[curIndex.value].status, "10100")

  // 改变阵容
  curCamp.value = curCamp.value ^ 1
  changeBox()
}

// 改变位置
function changePos(index: number, pos: Array<number>) {
  let lastPos = [chesses.value[index].x, chesses.value[index].y]
  chesses.value[index].changePos(chesses.value, pos)

  // 不处于悔棋状态则记录
  if (!common.hasStatus(chesses.value[index].status, "10000")) {
    recordPos(index, lastPos)
    refAudio.value.move()
  }
}

// 根据位置获取棋子索引
function getChessByPos(pos: Array<number>): number {
  for (let k = 0; k < chesses.value.length; k++) {
    let v = chesses.value[k]
    if (v.x === pos[0] && v.y === pos[1] && v.live) {
      return k
    }
  }
  return -1
}

// 改变行动阵营 并清空改变的阵容选中样式
function changeCamp() {
  curCamp.value = curCamp.value === 0 ? 1 : 0
  chesses.value = chesses.value.map((v, k) => {
    if (!isCurCamp(k, curCamp.value) && v.isChoose()) {
      v.notChoose()
    }
    return v
  })
}

// 是否是当前阵容
function isCurCamp(index: number, camp: number): boolean {
  let chooseChess = chesses.value[index]
  return common.isSameStatus(chooseChess.status, camp.toString())
}

// 当前棋子是否被选中
function hasChoose(index: number): boolean {
  return chesses.value[index].isChoose()
}

// 选择棋子
function choose(index: number) {
  let lastChess = chesses.value[curIndex.value]
  let chooseChess = chesses.value[index]

  // 选择状态取反
  chooseChess.choose()
  index !== curIndex.value ? lastChess.notChoose() : null

  chesses.value[curIndex.value] = lastChess
  chesses.value[index] = chooseChess
  curIndex.value = index
}

// 根据点击位置判断用户行为
function action(pos: Array<number>) {
  for (let k = 0; k < chesses.value.length; k++) {
    let v = chesses.value[k]
    if (!v.live) {
      continue
    }

    if (v.x === pos[0] && v.y === pos[1]) {
      // 根据阵容判断 选择棋子 还是攻击对方棋子
      if (isCurCamp(k, curCamp.value)) {
        return USER_ACTION.CHOOSE_CHESS
      } else if (isCurCamp(curIndex.value, curCamp.value) &&
          hasChoose(curIndex.value)) {
        return USER_ACTION.ATTACK_CHESS // 选择棋子不是当前阵容，而当前棋子是当前阵容，且处于选中状态
      }
    }
  }

  // 如果点击位置不是棋子
  if (isCurCamp(curIndex.value, curCamp.value)) {
    return USER_ACTION.MOVE_CHESS // 移动棋子
  }
  return USER_ACTION.NOT_ACTION
}

// 攻击对方棋子
function attackChess(index: number, pos: Array<number>) {
  // 改变当前棋子位置并删除对方棋子
  let i = getChessByPos(pos) // 先置为不存活，避免将军判断
  chesses.value[i].status = common.resetStatus(chesses.value[i].status, "10")
  chesses.value[index].attack() // 状态改为攻击

  try {
    changePos(index, pos)
    // 记录被吃棋子
    let len = record.length
    record[len - 1].eat = i
  } catch (e) {
    chesses.value[i].status = common.setStatus(chesses.value[i].status, "10") // 错误则重置存活
    throw new Error(e)
  } finally {
    chesses.value[index].move() // 状态重置
  }
}

// 改变选中图标
function changeBox() {
  setTimeout(() => {
    chessBoard.landing.hidden = true
    chessBoard.landing.box = curCamp.value ?
        chessBoard.landing.redBox : chessBoard.landing.blueBox
  }, 200)
}

// 电脑下棋
function machineStep(msg: string) {
  let step = JSON.parse(msg)
  step.start = [step.start.x, step.start.y]
  step.end = [step.end.x, step.end.y]

  // 人机为红方的翻转走法
  if (common.isSameStatus(mode.value, "00")) {
    step.start = [8 - step.start[0], 9 - step.start[1]]
    step.end = [8 - step.end[0], 9 - step.end[1]]
  }

  let startI = getChessByPos(step.start)
  let endI = getChessByPos(step.end)
  let action = USER_ACTION.ATTACK_CHESS

  if (endI === -1) {
    action = USER_ACTION.MOVE_CHESS
  }

  try {
    console.log("machineStep ", step, action)
    if (action === USER_ACTION.MOVE_CHESS) {
      choose(startI)
      moveChess(startI, step.end)
    } else if (action === USER_ACTION.ATTACK_CHESS) {
      choose(startI)
      attackTheChess(startI, step.end)
    }
  } catch (e) {
    console.log(e)
  }
}

// 绝杀检查
function checkmate() {
  if (moves.isCheckmate(chesses.value, curCamp.value)) {
    console.log("绝杀")
    close.value = true
    store.commit("updateTip", TIP_MSG.CHECKMATE)
  }
}

onMounted(() => {
  getDistance()
  start()
})

watch(
    () => store.state.tip,
    (val) => {
      if (val === TIP_MSG.KILLED_KING) {
        setTimeout(() => {
          goBack()
        }, 600)
      } else if (val === TIP_MSG.KILL_KING) {
        refAudio.value.king()
      }

      // 隐藏弹窗提示
      setTimeout(() => {
        store.commit("updateTip", "")
      }, 800)
    }
)

</script>

<template>
  <view ref="refContent" class="content">

    <Edit ref="refEdit"
          @start="start"
          @tryBack="tryBack"
          @goBack="goBack"
          @choose="choose"
          @moveChess="moveChess"
          @attackTheChess="attackTheChess"
          @machineStep="machineStep"></Edit>
    <Audio ref="refAudio"></Audio>

    <image ref="refBoard" src="@/static/chessboard.png" class="board" @tap="Controller"/>
    <view :class="chessBoard.landing.class" :style="chessBoard.landing.style"></view>
    <image :class="{'chess box': true, 'hidden': chessBoard.landing.hidden}"
           :style="chessBoard.landing.style"
           :src="chessBoard.landing.box"/>

    <view v-for="item in chesses" :key="item.id">
      <view class="chess" :style="item.style" v-if="item.live">
        <image :src="item.path.chess"/>
        <image :class="{'box': true, 'hidden': item.hiddenBox}"
               :src="chessBoard.landing.box"/>
      </view>
    </view>

  </view>
</template>

<style scoped lang="scss">
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: #d5e2d9;
}


// 棋盘
.board {
  position: absolute;
  width: 90%;
  height: 1000rpx;
  z-index: 2;
  top: 180rpx;
}


.chess {
  position: absolute;
  width: 83rpx;
  height: 83rpx;
  z-index: 3;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s ease;

  .box {
    position: absolute;
  }
}

.chess image {
  width: 80rpx;
  height: 80rpx;
}

.choose {
  background-color: #188de1;
  border-radius: 50%;
}

.choose-black {
  background-color: #FF9800;
  border-radius: 50%;
}

.choose-red {
  background-color: #43d649;
  border-radius: 50%;
}

.landing {
  position: absolute;
  width: 50rpx;
  height: 50rpx;
  z-index: 1;
  pointer-events: none;
  border: 3px solid #188de1;
  border-radius: 50%;
}

.edit {
  z-index: 2;
}

.unClick {
  pointer-events: none;
}

.hidden {
  display: none;
}

</style>
