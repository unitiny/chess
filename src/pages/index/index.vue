<template>
  <view class="content">
    <image class="background" src="@/static/img/background.png"></image>
    <view class="panel">
      <view v-for="(item, index) in panel"
            :key="index"
            @tap="action(item.url, index)">
        {{ item.text }}
      </view>
    </view>

    <view :class="{'model': true, 'hidden': !model.show}" @tap="modelEvent">
      <view class="content" @tap.stop="">
        <view>{{ model.title }}</view>
        <input type="text" v-model="room"/>
        <view class="button" @tap="modelHandle">确定</view>
      </view>
    </view>

    <fui-toast ref="refToast"></fui-toast>

  </view>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {MODE_STATUS, PANEL_ATTRIBUTE, PANEL_DOUBLE_ATTRIBUTE} from "@/config";
import store from "@/store";
import {HaveRoom, LeaveRoom} from "@/api";
import * as common from "@/store/common";
import {Objects} from "@/store/model";

const refToast = ref(null)

const panel = ref(PANEL_ATTRIBUTE) // 面板
const page = ref(0) // 0 首页  1 双人对战配置页
const room = ref("") // 双人对战房间号
const model = reactive({show: false, title: "", url: "", choose: 0}) // 0 创建房间 1 进入房间

function action(url: string, index: number) {
  // 首页面板
  if (page.value === 0) {
    if (index === 0) {
      panel.value = PANEL_DOUBLE_ATTRIBUTE
      page.value = 1
    } else {
      // 选择自定义对局
      store.commit("updateMode", "111") // 自定义|创建者|玩家|玩家|红方
      uni.navigateTo({
        url: url
      })
    }
  } else { // 双人面板配置
    switch (index) {
      case 0:
      case 1:
        // 弹窗配置
        model.title = panel.value[index].text
        model.url = panel.value[index].url
        model.choose = index
        modelEvent()
        break
      case 2:
        uni.navigateTo({
          url: url
        })
        break
    }
  }
}

function modelEvent() {
  model.show = !model.show
}

function modelHandle() {
  // 检查房间是否存在，并校验对应行为
  let data = {room: room.value}
  HaveRoom(data).then((res) => {
        console.log(res, model)
        if (model.choose === 0 && res.data.Data === 1) {
          console.log("房间已存在")
          showToast("房间已存在")
          return;
        } else if (model.choose === 1 && res.data.Data === 0) {
          console.log("房间不存在")
          showToast("房间不存在")
          return;
        }

        store.commit("updateRoom", room.value)

        let mode = ""
        if (model.choose === 0) {
          mode = common.mergeStatus(["1", "10", "100", "10000"]) // 双人|创建者|玩家|玩家|红方
        } else {
          mode = common.mergeStatus(["10", "100", "1000", "10000"]) // 双人|加入者|玩家|玩家|黑方
        }
        store.commit("updateMode", mode)

        room.value = ""
        uni.navigateTo({
          url: model.url
        })
      }
  )

  modelEvent()
}

function showToast(text: string) {
  let options: Objects = {}
  //提示信息
  options.text = text;
  refToast.value.show(options)
}

onMounted(() => {
  store.commit("updateName", "user-" + common.randString())
  store.commit("updateRoom", "room-" + common.randString())
  console.log(store.state.name, store.state.room)
})
</script>

<style scoped lang="scss">
.content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.background {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.panel {
  height: 500rpx;
  width: 100%;

  view {
    margin: 40rpx auto;
    width: 45%;
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

.model {
  position: absolute;
  width: 100%;
  height: 100%;

  .content {
    position: absolute;
    width: 500rpx;
    height: 350rpx;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    background: #f7f8fc;
    font-size: 22px;
    border: 1px solid #1c81d5;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;

    input {
      height: 60rpx;
      width: 80%;
      border: 1px solid #1c81d5;
    }
  }
}

.hidden {
  display: none;
}
</style>
