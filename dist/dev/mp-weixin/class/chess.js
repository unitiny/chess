"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var config_index = require("../config/index.js");
var store_rules = require("../store/rules.js");
var store_common = require("../store/common.js");
var config_error = require("../config/error.js");
var store_index = require("../store/index.js");
let id = 0;
class Chess {
  constructor(x, y, name, camp) {
    __publicField(this, "id");
    __publicField(this, "x");
    __publicField(this, "y");
    __publicField(this, "name");
    __publicField(this, "status");
    this.id = id++ % 32;
    this.x = x;
    this.y = y;
    this.name = name;
    this.status = store_common.mergeStatus([config_index.CHESS_STATUS.LIVE, camp]);
  }
  get style() {
    let pos_x = `${config_index.CHESSBOARD.LT_POS[0] + config_index.CHESSBOARD.WIDTH * this.x}rpx`;
    let pos_y = `${config_index.CHESSBOARD.LT_POS[1] + config_index.CHESSBOARD.HEIGHT * this.y}rpx`;
    return `left:${pos_x};top: ${pos_y}`;
  }
  get class() {
    return this.isChoose() ? "choose" : "unchoose";
  }
  get path() {
    let name = this.name.toLowerCase();
    if (store_common.hasStatus(this.status, "1")) {
      name = `red-${name}`;
    }
    return `../../static/img/${name}.png`;
  }
  get camp() {
    return this.status[this.status.length - 1];
  }
  get live() {
    return store_common.hasStatus(this.status, "10");
  }
  get bottom() {
    return store_common.hasStatus(this.status, "1") ? config_index.CHESSBOARD.RED_BOTTOM : config_index.CHESSBOARD.BLACK_BOTTOM;
  }
  isChoose() {
    return store_common.hasStatus(this.status, "100");
  }
  choose() {
    this.status = store_common.reverseStatus(this.status, "100");
  }
  notChoose() {
    this.status = store_common.resetStatus(this.status, "100");
  }
  attack() {
    this.status = store_common.setStatus(this.status, "1000");
  }
  move() {
    this.status = store_common.resetStatus(this.status, "1000");
  }
  back() {
    return store_common.hasStatus(this.status, "10000");
  }
  changePos(chesses, pos) {
    if (!this.isChoose()) {
      throw new Error(config_error.ERROR.UNCHOOSE_CHESS);
    }
    if (!this.back()) {
      this.checkRule(chesses, [this.x, this.y], pos, this.bottom);
    }
    this.x = pos[0];
    this.y = pos[1];
    if (!this.back()) {
      this.checkKing(chesses);
    }
  }
  checkRule(chesses, start, target, bottom) {
    let action = store_common.hasStatus(this.status, "1000") ? config_index.USER_ACTION.ATTACK_CHESS : config_index.USER_ACTION.MOVE_CHESS;
    switch (this.name) {
      case config_index.CHESS_NAME.SOLDIER:
        store_rules.Soldier(start, target, bottom);
        break;
      case config_index.CHESS_NAME.CANNON:
        store_rules.Cannon(chesses, start, target, bottom, action);
        break;
      case config_index.CHESS_NAME.CAR:
        store_rules.Car(chesses, start, target);
        break;
      case config_index.CHESS_NAME.HORSE:
        store_rules.Horse(chesses, start, target);
        break;
      case config_index.CHESS_NAME.ELEPHANT:
        store_rules.Elephant(chesses, start, target, bottom);
        break;
      case config_index.CHESS_NAME.SCHOLAR:
        store_rules.Scholar(start, target, bottom);
        break;
      case config_index.CHESS_NAME.KING:
        store_rules.King(chesses, start, target, bottom);
        break;
    }
  }
  checkKing(chesses) {
    let king = {};
    let selfKing = {};
    for (const chess of chesses) {
      if (chess.name === config_index.CHESS_NAME.KING) {
        chess.camp !== this.camp ? king = chess : selfKing = chess;
      }
    }
    let isKing = false, isSelfKing = false;
    for (const chess of chesses) {
      chess.attack();
      try {
        if (chess.camp === this.camp) {
          chess.checkRule(chesses, [chess.x, chess.y], [king.x, king.y], chess.bottom);
          isKing = true;
        } else {
          chess.checkRule(chesses, [chess.x, chess.y], [selfKing.x, selfKing.y], chess.bottom);
          isSelfKing = true;
        }
      } catch (e) {
      }
      chess.move();
    }
    if (isSelfKing) {
      console.log("\u88AB\u5C06\u519B");
      store_index.store.commit("updateTip", config_index.TIP_MSG.KILLED_KING);
    } else if (isKing) {
      console.log("\u5C06\u519B");
      store_index.store.commit("updateTip", config_index.TIP_MSG.KILL_KING);
    }
    setTimeout(() => {
      store_index.store.commit("updateTip", "");
    }, 600);
  }
}
exports.Chess = Chess;
