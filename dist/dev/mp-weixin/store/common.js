"use strict";
function _checkStatus(status) {
  if (status[0] === "0") {
    console.log("status \u9996\u4F4D\u4E0D\u5F97\u4E3A\u96F6");
    return false;
  }
  return true;
}
function isSameStatus(status, target, offset = 0) {
  if (status.length < target.length) {
    console.log("isSameStatus \u72B6\u6001\u957F\u5EA6\u4E0D\u5F97\u5C0F\u4E8E\u76EE\u6807\u72B6\u6001");
  }
  let start = status.length - target.length;
  let end = status.length - offset;
  return status.slice(start, end) === target;
}
function hasStatus(status, target) {
  if (!_checkStatus(target)) {
    return false;
  }
  return (parseInt(status, 2) & parseInt(target, 2)) === parseInt(target, 2);
}
function reverseStatus(status, target) {
  if (!_checkStatus(target)) {
    return "";
  }
  let num = parseInt(status, 2) ^ parseInt(target, 2);
  return num.toString(2);
}
function resetStatus(status, target) {
  return (parseInt(status, 2) & ~parseInt(target, 2)).toString(2);
}
function setStatus(status, target) {
  return (parseInt(status, 2) | parseInt(target, 2)).toString(2);
}
function mergeStatus(s) {
  let res = 0;
  for (let i = 0; i < s.length; i++) {
    res = res | parseInt(s[i], 2);
  }
  return res.toString(2);
}
exports.hasStatus = hasStatus;
exports.isSameStatus = isSameStatus;
exports.mergeStatus = mergeStatus;
exports.resetStatus = resetStatus;
exports.reverseStatus = reverseStatus;
exports.setStatus = setStatus;
