"use strict";
const CHESS_NAME = {
  SOLDIER: "SOLDIER",
  CANNON: "CANNON",
  CAR: "CAR",
  HORSE: "HORSE",
  ELEPHANT: "ELEPHANT",
  SCHOLAR: "SCHOLAR",
  KING: "KING"
};
const CHESS_STATUS = {
  BLOCK: "0",
  RED: "1",
  LIVE: "10",
  CHOOSE: "100",
  ATTACK: "1000",
  BACK: "10000"
};
const CHESS_ATTRIBUTES = [
  { "x": 0, "y": 6, "name": CHESS_NAME.SOLDIER, "camp": CHESS_STATUS.RED },
  { "x": 2, "y": 6, "name": CHESS_NAME.SOLDIER, "camp": CHESS_STATUS.RED },
  { "x": 4, "y": 6, "name": CHESS_NAME.SOLDIER, "camp": CHESS_STATUS.RED },
  { "x": 6, "y": 6, "name": CHESS_NAME.SOLDIER, "camp": CHESS_STATUS.RED },
  { "x": 8, "y": 6, "name": CHESS_NAME.SOLDIER, "camp": CHESS_STATUS.RED },
  { "x": 1, "y": 7, "name": CHESS_NAME.CANNON, "camp": CHESS_STATUS.RED },
  { "x": 7, "y": 7, "name": CHESS_NAME.CANNON, "camp": CHESS_STATUS.RED },
  { "x": 0, "y": 9, "name": CHESS_NAME.CAR, "camp": CHESS_STATUS.RED },
  { "x": 8, "y": 9, "name": CHESS_NAME.CAR, "camp": CHESS_STATUS.RED },
  { "x": 1, "y": 9, "name": CHESS_NAME.HORSE, "camp": CHESS_STATUS.RED },
  { "x": 7, "y": 9, "name": CHESS_NAME.HORSE, "camp": CHESS_STATUS.RED },
  { "x": 2, "y": 9, "name": CHESS_NAME.ELEPHANT, "camp": CHESS_STATUS.RED },
  { "x": 6, "y": 9, "name": CHESS_NAME.ELEPHANT, "camp": CHESS_STATUS.RED },
  { "x": 3, "y": 9, "name": CHESS_NAME.SCHOLAR, "camp": CHESS_STATUS.RED },
  { "x": 5, "y": 9, "name": CHESS_NAME.SCHOLAR, "camp": CHESS_STATUS.RED },
  { "x": 4, "y": 9, "name": CHESS_NAME.KING, "camp": CHESS_STATUS.RED },
  { "x": 0, "y": 3, "name": CHESS_NAME.SOLDIER, "camp": CHESS_STATUS.BLOCK },
  { "x": 2, "y": 3, "name": CHESS_NAME.SOLDIER, "camp": CHESS_STATUS.BLOCK },
  { "x": 4, "y": 3, "name": CHESS_NAME.SOLDIER, "camp": CHESS_STATUS.BLOCK },
  { "x": 6, "y": 3, "name": CHESS_NAME.SOLDIER, "camp": CHESS_STATUS.BLOCK },
  { "x": 8, "y": 3, "name": CHESS_NAME.SOLDIER, "camp": CHESS_STATUS.BLOCK },
  { "x": 1, "y": 2, "name": CHESS_NAME.CANNON, "camp": CHESS_STATUS.BLOCK },
  { "x": 7, "y": 2, "name": CHESS_NAME.CANNON, "camp": CHESS_STATUS.BLOCK },
  { "x": 0, "y": 0, "name": CHESS_NAME.CAR, "camp": CHESS_STATUS.BLOCK },
  { "x": 8, "y": 0, "name": CHESS_NAME.CAR, "camp": CHESS_STATUS.BLOCK },
  { "x": 1, "y": 0, "name": CHESS_NAME.HORSE, "camp": CHESS_STATUS.BLOCK },
  { "x": 7, "y": 0, "name": CHESS_NAME.HORSE, "camp": CHESS_STATUS.BLOCK },
  { "x": 2, "y": 0, "name": CHESS_NAME.ELEPHANT, "camp": CHESS_STATUS.BLOCK },
  { "x": 6, "y": 0, "name": CHESS_NAME.ELEPHANT, "camp": CHESS_STATUS.BLOCK },
  { "x": 3, "y": 0, "name": CHESS_NAME.SCHOLAR, "camp": CHESS_STATUS.BLOCK },
  { "x": 5, "y": 0, "name": CHESS_NAME.SCHOLAR, "camp": CHESS_STATUS.BLOCK },
  { "x": 4, "y": 0, "name": CHESS_NAME.KING, "camp": CHESS_STATUS.BLOCK }
];
const CHESSBOARD = {
  LT_POS: [5, 20],
  WIDTH: 82,
  HEIGHT: 107,
  BLACK_BOTTOM: 0,
  RED_BOTTOM: 9
};
const USER_ACTION = {
  CHOOSE_CHESS: "CHOOSE_CHESS",
  MOVE_CHESS: "MOVE_CHESS",
  ATTACK_CHESS: "ATTACK_CHESS",
  NOT_ACTION: "NOT_ACTION"
};
const PANEL_ATTRIBUTE = [
  { "text": "\u53CC\u4EBA\u5BF9\u6218", "url": "../chess/index?type=0" },
  { "text": "\u81EA\u5B9A\u4E49\u5BF9\u5C40", "url": "../chess/index?type=1" }
];
const MODEL_ATTRIBUTE = [
  { "text": "\u7EA2\u65B9\uFF1A", "span": "\u68CB\u624B" },
  { "text": "\u9ED1\u65B9\uFF1A", "span": "\u68CB\u624B" }
];
const TIP_MSG = {
  KILL_KING: "\u5C06\u519B",
  KILLED_KING: "\u5C06\u88AB\u5C06\u519B"
};
exports.CHESSBOARD = CHESSBOARD;
exports.CHESS_ATTRIBUTES = CHESS_ATTRIBUTES;
exports.CHESS_NAME = CHESS_NAME;
exports.CHESS_STATUS = CHESS_STATUS;
exports.MODEL_ATTRIBUTE = MODEL_ATTRIBUTE;
exports.PANEL_ATTRIBUTE = PANEL_ATTRIBUTE;
exports.TIP_MSG = TIP_MSG;
exports.USER_ACTION = USER_ACTION;
