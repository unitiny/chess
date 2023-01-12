"use strict";
var common_vendor = require("../../common/vendor.js");
var class_chess = require("../../class/chess.js");
var class_chessBoard = require("../../class/chessBoard.js");
var config_index = require("../../config/index.js");
var store_common = require("../../store/common.js");
var store_index = require("../../store/index.js");
require("../../store/rules.js");
require("../../config/error.js");
var _imports_0 = "/static/chessboard.png";
if (!Math) {
  (Edit + Audio)();
}
const Edit = () => "./edit.js";
const Audio = () => "./audio.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  setup(__props) {
    const refAudio = common_vendor.ref(null);
    let chesses = common_vendor.reactive([]);
    let curIndex = common_vendor.ref(0);
    let curCamp = common_vendor.ref(1);
    let record = common_vendor.reactive([]);
    let chessBoard = common_vendor.reactive(new class_chessBoard.ChessBoard());
    function init() {
      chesses.length = 0;
      for (let i = 0; i < config_index.CHESS_ATTRIBUTES.length; i++) {
        let obj = config_index.CHESS_ATTRIBUTES[i];
        chesses.push(new class_chess.Chess(obj.x, obj.y, obj.name, obj.camp));
      }
    }
    function start(status) {
      if (status === "0") {
        console.log("\u4E24\u4EBA\u673A");
      } else if (status === "1") {
        curCamp.value = 0;
        let num = config_index.CHESSBOARD.RED_BOTTOM;
        config_index.CHESSBOARD.RED_BOTTOM = config_index.CHESSBOARD.BLACK_BOTTOM;
        config_index.CHESSBOARD.BLACK_BOTTOM = num;
        init();
        for (let i = 0; i < chesses.length; i++) {
          chesses[i].status = store_common.reverseStatus(chesses[i].status, "1");
        }
      } else {
        curCamp.value = 1;
        init();
      }
      chessBoard.landing.class += " ";
    }
    function Controller(e) {
      let pos = chessBoard.getPos(e);
      let cmd = action(pos);
      let index = getChessByPos(pos);
      console.log(pos, cmd, index);
      try {
        switch (cmd) {
          case config_index.USER_ACTION.CHOOSE_CHESS:
            choose(index);
            break;
          case config_index.USER_ACTION.MOVE_CHESS:
            changePos(pos);
            changeCamp();
            break;
          case config_index.USER_ACTION.ATTACK_CHESS:
            attackChess(pos);
            changeCamp();
            break;
        }
      } catch (e2) {
        console.log(e2);
      }
    }
    function recordPos(pos) {
      let chess = chesses[curIndex.value];
      let step = { index: chess.id, start: pos, end: [chess.x, chess.y] };
      record.push(step);
    }
    function goBack() {
      let len = record.length;
      if (len === 0) {
        return;
      }
      let step = record[len - 1];
      record = record.slice(0, len - 1);
      if (step.eat) {
        chesses[step.eat].status = store_common.setStatus(chesses[step.eat].status, "10");
      }
      curIndex.value = step.index;
      chesses[curIndex.value].status = store_common.setStatus(chesses[curIndex.value].status, "10100");
      changePos(step.start);
      chesses[curIndex.value].status = store_common.resetStatus(chesses[curIndex.value].status, "10100");
      curCamp.value = curCamp.value ^ 1;
    }
    function changePos(pos) {
      let lastPos = [chesses[curIndex.value].x, chesses[curIndex.value].y];
      chesses[curIndex.value].changePos(chesses, pos);
      if (!store_common.hasStatus(chesses[curIndex.value].status, "10000")) {
        recordPos(lastPos);
        refAudio.value.move();
      }
    }
    function getChessByPos(pos) {
      for (let k = 0; k < chesses.length; k++) {
        let v = chesses[k];
        if (v.x === pos[0] && v.y === pos[1] && v.live) {
          return k;
        }
      }
      return 0;
    }
    function changeCamp() {
      curCamp.value = curCamp.value === 0 ? 1 : 0;
      chesses = chesses.map((v, k) => {
        if (!isCurCamp(k, curCamp.value) && v.isChoose()) {
          v.notChoose();
        }
        return v;
      });
    }
    function isCurCamp(index, camp) {
      let chooseChess = chesses[index];
      return store_common.isSameStatus(chooseChess.status, camp.toString());
    }
    function hasChoose(index) {
      return chesses[index].isChoose();
    }
    function choose(index) {
      let lastChess = chesses[curIndex.value];
      let chooseChess = chesses[index];
      chooseChess.choose();
      index !== curIndex.value ? lastChess.notChoose() : null;
      chesses[curIndex.value] = lastChess;
      chesses[index] = chooseChess;
      curIndex.value = index;
    }
    function action(pos) {
      for (let k = 0; k < chesses.length; k++) {
        let v = chesses[k];
        if (!v.live) {
          continue;
        }
        if (v.x === pos[0] && v.y === pos[1]) {
          if (isCurCamp(k, curCamp.value)) {
            return config_index.USER_ACTION.CHOOSE_CHESS;
          } else if (isCurCamp(curIndex.value, curCamp.value) && hasChoose(curIndex.value)) {
            return config_index.USER_ACTION.ATTACK_CHESS;
          }
        }
      }
      if (isCurCamp(curIndex.value, curCamp.value)) {
        return config_index.USER_ACTION.MOVE_CHESS;
      }
      return config_index.USER_ACTION.NOT_ACTION;
    }
    function attackChess(pos) {
      let i = getChessByPos(pos);
      chesses[curIndex.value].attack();
      changePos(pos);
      chesses[i].status = store_common.resetStatus(chesses[i].status, "10");
      let len = record.length;
      record[len - 1].eat = i;
      chesses[curIndex.value].move();
    }
    common_vendor.onMounted(() => {
      init();
    });
    common_vendor.watch(
      () => store_index.store.state.tip,
      (val) => {
        if (val === config_index.TIP_MSG.KILLED_KING) {
          setTimeout(() => {
            goBack();
          }, 600);
        } else if (val === config_index.TIP_MSG.KILL_KING) {
          refAudio.value.king();
        }
      }
    );
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(start),
        b: common_vendor.o(goBack),
        c: common_vendor.sr(refAudio, "271924af-1", {
          "k": "refAudio"
        }),
        d: _imports_0,
        e: common_vendor.o(Controller),
        f: common_vendor.n(common_vendor.unref(chessBoard).landing.class),
        g: common_vendor.s(common_vendor.unref(chessBoard).landing.style),
        h: common_vendor.f(common_vendor.unref(chesses), (item, k0, i0) => {
          return common_vendor.e({
            a: item.live
          }, item.live ? {
            b: item.path,
            c: common_vendor.n("chess " + item.class),
            d: common_vendor.s(item.style)
          } : {}, {
            e: item.id
          });
        })
      };
    };
  }
});
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-271924af"], ["__file", "D:/PersonItem/chinese-chess/src/pages/chess/index.vue"]]);
wx.createPage(MiniProgramPage);
