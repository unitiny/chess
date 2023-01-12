"use strict";
var common_vendor = require("../../common/vendor.js");
var store_common = require("../../store/common.js");
var config_index = require("../../config/index.js");
var store_index = require("../../store/index.js");
var _imports_0 = "/static/img/red-king.png";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  emits: ["start", "goBack"],
  setup(__props, { emit }) {
    let model = common_vendor.reactive(config_index.MODEL_ATTRIBUTE);
    let hiddenModel = common_vendor.reactive({ start: true, chat: true });
    let modelStatus = common_vendor.ref("11");
    let tip = common_vendor.ref(common_vendor.computed$1(() => store_index.store.state.tip));
    function showConfig() {
      hiddenModel.start = !hiddenModel.start;
    }
    function showChat() {
      hiddenModel.chat = !hiddenModel.chat;
    }
    function exchange(index) {
      let status = index === 0 ? "10" : "1";
      modelStatus.value = store_common.reverseStatus(modelStatus.value, status);
    }
    function confirm() {
      emit("start", modelStatus.value);
      showConfig();
    }
    function sendMsg() {
      console.log("sendMsg");
    }
    function back() {
      emit("goBack");
    }
    common_vendor.watch(
      () => modelStatus.value,
      () => {
        model[0].span = store_common.hasStatus(modelStatus.value, "10") ? "\u68CB\u624B" : "\u7535\u8111";
        model[1].span = store_common.hasStatus(modelStatus.value, "1") ? "\u68CB\u624B" : "\u7535\u8111";
      },
      {
        deep: true
      }
    );
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: _imports_0,
        b: common_vendor.o(showConfig),
        c: common_vendor.o(showChat),
        d: common_vendor.o(back),
        e: common_vendor.f(common_vendor.unref(model), (item, index, i0) => {
          return {
            a: common_vendor.t(item.text),
            b: common_vendor.t(item.span),
            c: common_vendor.o(($event) => exchange(index)),
            d: index
          };
        }),
        f: common_vendor.o(confirm),
        g: common_vendor.unref(hiddenModel).start ? 1 : "",
        h: common_vendor.f(10, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item
          };
        }),
        i: common_vendor.o(sendMsg),
        j: common_vendor.unref(hiddenModel).chat ? 1 : "",
        k: common_vendor.t(common_vendor.unref(tip)),
        l: common_vendor.unref(tip) === "" ? 1 : ""
      };
    };
  }
});
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-01b7a686"], ["__file", "D:/PersonItem/chinese-chess/src/pages/chess/edit.vue"]]);
wx.createComponent(Component);
