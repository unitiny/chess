<script setup lang="ts">
import {onMounted, reactive} from "vue";

const King = uni.createInnerAudioContext()
const Move = uni.createInnerAudioContext()
const Checkmate = uni.createInnerAudioContext()

function king() {
  King.play()
}

function move() {
  Move.play()

  setTimeout(() => {
    Move.stop()
  }, 300)
}

function checkmate() {

}

onMounted(() => {
  King.src = "/static/audio/king.mp3"
  King.startTime = 0.3

  Move.src = "/static/audio/move.mp3"

})

defineExpose({king, move})
</script>

<template>
  <view>
  </view>
</template>

<style scoped lang="scss">

</style>
