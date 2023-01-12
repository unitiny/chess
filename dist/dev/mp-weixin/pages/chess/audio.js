"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  setup(__props, { expose }) {
    const King = common_vendor.index.createInnerAudioContext();
    const Move = common_vendor.index.createInnerAudioContext();
    function king() {
      King.play();
    }
    function move() {
      Move.play();
      setTimeout(() => {
        Move.stop();
      }, 300);
    }
    common_vendor.onMounted(() => {
      King.src = "/static/audio/king.mp3";
      King.startTime = 0.3;
      Move.src = "/static/audio/move.mp3";
    });
    expose({ king, move });
    return (_ctx, _cache) => {
      return {};
    };
  }
});
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/PersonItem/chinese-chess/src/pages/chess/audio.vue"]]);
wx.createComponent(Component);
