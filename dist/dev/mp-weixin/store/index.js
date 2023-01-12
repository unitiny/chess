"use strict";
var common_vendor = require("../common/vendor.js");
const store = common_vendor.createStore({
  state: {
    tip: ""
  },
  mutations: {
    updateTip(state, val) {
      state.tip = val;
    }
  }
});
exports.store = store;
