"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var config_index = require("../config/index.js");
class ChessBoard {
  constructor() {
    __publicField(this, "width");
    __publicField(this, "height");
    __publicField(this, "lt_pos");
    __publicField(this, "landing");
    this.width = config_index.CHESSBOARD.WIDTH;
    this.height = config_index.CHESSBOARD.HEIGHT;
    this.lt_pos = config_index.CHESSBOARD.LT_POS;
    this.landing = { class: "", style: "" };
  }
  getLanding(pos) {
    this.landing.class = "landing";
    let pos_x = `${config_index.CHESSBOARD.LT_POS[0] + config_index.CHESSBOARD.WIDTH * pos[0] + 12}rpx`;
    let pos_y = `${config_index.CHESSBOARD.LT_POS[1] + config_index.CHESSBOARD.HEIGHT * pos[1] + 8}rpx`;
    this.landing.style = `left:${pos_x};top: ${pos_y}`;
  }
  getPos(e) {
    const { x, y } = e.detail;
    const width = config_index.CHESSBOARD.WIDTH / 2;
    const height = config_index.CHESSBOARD.HEIGHT / 2;
    const left = config_index.CHESSBOARD.LT_POS[0] / 2;
    const top = config_index.CHESSBOARD.LT_POS[1] / 2;
    let row = Math.abs(Math.ceil((x - left) / width) - 1);
    let column = Math.abs(Math.ceil((y - top) / height) - 1);
    row = row >= 9 ? 8 : row;
    column = column >= 10 ? 9 : column;
    let pos = [row, column];
    this.getLanding(pos);
    setTimeout(() => {
      this.landing.class = "";
    }, 200);
    return pos;
  }
}
exports.ChessBoard = ChessBoard;
