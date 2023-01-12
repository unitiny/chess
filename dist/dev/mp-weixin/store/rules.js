"use strict";
var config_error = require("../config/error.js");
var config_index = require("../config/index.js");
function regOffset(offset, start, target) {
  for (let i = 0; i < offset.length; i++) {
    let x = start[0] + offset[i][0];
    let y = start[1] + offset[i][1];
    if (x >= 0 && x <= 9 && y >= 0 && y <= 9) {
      if (target.join() === `${x},${y}`) {
        return true;
      }
    }
  }
  return false;
}
function pathChessNum(chesses, start, target) {
  let column = target[0] === start[0];
  let row = target[1] === start[1];
  let num = 0;
  for (const chess of chesses) {
    if (!chess.live) {
      continue;
    }
    if (chess.x === start[0] && column) {
      if (target[1] > chess.y && chess.y > start[1] || target[1] < chess.y && chess.y < start[1]) {
        num++;
      }
    } else if (chess.y === start[1] && row) {
      if (target[0] > chess.x && chess.x > start[0] || target[0] < chess.x && chess.x < start[0]) {
        num++;
      }
    }
  }
  return num;
}
function Soldier(start, target, bottom) {
  let startOffset = Math.abs(start[1] - bottom);
  let targetOffset = Math.abs(target[1] - bottom);
  let offsetX = Math.abs(start[0] - target[0]);
  let offsetY = Math.abs(start[1] - target[1]);
  if (startOffset <= 4) {
    if (target[0] !== start[0] || targetOffset !== startOffset + 1) {
      throw new Error(config_error.ERROR.TARGET_POS_ERROR);
    }
  } else {
    if (targetOffset < startOffset || offsetX > 1 || offsetY > 1 || offsetX === 1 && offsetY == 1 || targetOffset > 9) {
      throw new Error(config_error.ERROR.TARGET_POS_ERROR);
    }
  }
}
function Cannon(chesses, start, target, bottom, action) {
  let row = target[1] === start[1];
  let column = target[0] === start[0];
  if (!(column || row)) {
    throw new Error(config_error.ERROR.TARGET_POS_ERROR);
  }
  let num = pathChessNum(chesses, start, target);
  if (action === config_index.USER_ACTION.ATTACK_CHESS && num !== 1) {
    throw new Error(config_error.ERROR.NOT_WAY_ATTACK);
  } else if (action === config_index.USER_ACTION.MOVE_CHESS && num !== 0) {
    throw new Error(config_error.ERROR.POS_LIMITED);
  }
}
function Car(chesses, start, target, bottom, action) {
  let column = target[0] === start[0];
  let row = target[1] === start[1];
  if (!(column || row)) {
    throw new Error(config_error.ERROR.TARGET_POS_ERROR);
  }
  let num = pathChessNum(chesses, start, target);
  if (num !== 0) {
    throw new Error(config_error.ERROR.POS_LIMITED);
  }
}
function Horse(chesses, start, target, bottom) {
  let offset = [[2, 1], [-2, 1], [2, -1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
  if (!regOffset(offset, start, target)) {
    throw new Error(config_error.ERROR.TARGET_POS_ERROR);
  }
  let foot = [];
  if (target[0] === start[0] + 2 && (target[1] === start[1] + 1 || target[1] === start[1] - 1)) {
    foot = [start[0] + 1, start[1]];
  } else if (target[1] === start[1] - 2 && (target[0] === start[0] + 1 || target[0] === start[0] - 1)) {
    foot = [start[0], start[1] - 1];
  } else if (target[0] === start[0] - 2 && (target[1] === start[1] + 1 || target[1] === start[1] - 1)) {
    foot = [start[0] - 1, start[1]];
  } else {
    foot = [start[0], start[1] + 1];
  }
  for (const chess of chesses) {
    if (chess.live && chess.x === foot[0] && chess.y === foot[1]) {
      throw new Error(config_error.ERROR.NOT_WAY_ATTACK);
    }
  }
}
function Elephant(chesses, start, target, bottom) {
  let offset = [[2, 2], [2, -2], [-2, 2], [-2, -2]];
  let targetOffset = Math.abs(target[1] - bottom);
  if (!regOffset(offset, start, target) || targetOffset > 4) {
    throw new Error(config_error.ERROR.TARGET_POS_ERROR);
  }
  let foot = [];
  if (target[0] === start[0] + 2 && target[1] === start[1] + 2) {
    foot = [start[0] + 1, start[1] + 1];
  } else if (target[0] === start[0] + 2 && target[1] === start[1] - 2) {
    foot = [start[0] + 1, start[1] - 1];
  } else if (target[0] === start[0] - 2 && target[1] === start[1] + 2) {
    foot = [start[0] - 1, start[1] + 1];
  } else {
    foot = [start[0] - 1, start[1] - 1];
  }
  for (const chess of chesses) {
    if (chess.live && chess.x === foot[0] && chess.y === foot[1]) {
      throw new Error(config_error.ERROR.NOT_WAY_ATTACK);
    }
  }
}
function Scholar(start, target, bottom) {
  let startOffset = Math.abs(start[1] - bottom);
  let targetOffset = Math.abs(target[1] - bottom);
  let res = false;
  if (startOffset === 0 || startOffset === 2) {
    if (target[0] !== 4 || targetOffset !== 1) {
      res = true;
    }
  } else if (startOffset === 1) {
    let offset = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    if (!regOffset(offset, start, target)) {
      res = true;
    }
  } else {
    res = true;
  }
  if (res) {
    throw new Error(config_error.ERROR.TARGET_POS_ERROR);
  }
}
function King(chesses, start, target, bottom) {
  let offset = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  let targetOffset = Math.abs(target[1] - bottom);
  for (const chess of chesses) {
    if (chess.live && chess.name === config_index.CHESS_NAME.KING && chess.x === target[0] && chess.y === target[1] && start[0] === target[0] && pathChessNum(chesses, start, target) === 0) {
      return;
    }
  }
  if (!regOffset(offset, start, target) || targetOffset > 2 || target[0] < 3 || target[0] > 5) {
    throw new Error(config_error.ERROR.TARGET_POS_ERROR);
  }
}
exports.Cannon = Cannon;
exports.Car = Car;
exports.Elephant = Elephant;
exports.Horse = Horse;
exports.King = King;
exports.Scholar = Scholar;
exports.Soldier = Soldier;
