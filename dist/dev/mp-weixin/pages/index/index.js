"use strict";
var common_vendor = require("../../common/vendor.js");
var config_index = require("../../config/index.js");
var _imports_0 = "/static/img/background.png";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  setup(__props) {
    const panel = common_vendor.reactive(config_index.PANEL_ATTRIBUTE);
    function skip(url) {
      common_vendor.index.navigateTo({
        url
      });
    }
    return (_ctx, _cache) => {
      return {
        a: _imports_0,
        b: common_vendor.f(common_vendor.unref(panel), (item, index, i0) => {
          return {
            a: common_vendor.t(item.text),
            b: index,
            c: common_vendor.o(($event) => skip(item.url))
          };
        })
      };
    };
  }
});
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1badc801"], ["__file", "D:/PersonItem/chinese-chess/src/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
