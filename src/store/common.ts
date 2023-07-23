/**
 * 检查状态是否合法
 * @param status
 */
import {Objects, Position} from "@/store/model";
import Chess from "@/class/chess";

function _checkStatus(status: string): boolean {
    if (status[0] === "0") {
        console.log("status 首位不得为零")
        return false
    }
    return true
}

/**
 * 判断状态的某部分是否为目标状态
 * @param status
 * @param target
 * @param offset 向左偏移位，默认0
 * @example "101", "01" => true | "1010", "01", 1 => true
 */
function isSameStatus(status: string, target: string, offset: number = 0): boolean {
    if (status.length < target.length) {
        console.log("isSameStatus 状态长度不得小于目标状态")
    }

    let start = status.length - target.length - offset
    let end = status.length - offset
    return status.slice(start, end) === target
}

/**
 * 状态位是否符合目标状态中有 1 要求的状态位
 * @param status
 * @param target
 * @example "1101", "1001" => true | "1001", "100" => false
 */
function hasStatus(status: string, target: string): boolean {
    if (!_checkStatus(target)) {
        return false
    }

    return (parseInt(status, 2) & parseInt(target, 2)) === parseInt(target, 2)
}

/**
 * 状态某位数取反，其余位不变
 * @param status
 * @param target
 * @example "1001", "100" => "1101" | "1001", "1000" => "1"
 */
function reverseStatus(status: string, target: string): string {
    if (!_checkStatus(target)) {
        return ""
    }

    let num = parseInt(status, 2) ^ parseInt(target, 2)
    return num.toString(2)
}

/**
 * 状态某位数归零 即状态重置，其余位不变
 * @param status
 * @param target
 */
function resetStatus(status: string, target: string) :string {
    // 取反后按位与
    return (parseInt(status, 2) & ~parseInt(target, 2)).toString(2)
}

/**
 * 状态某位数归 1
 * @param status
 * @param target
 */
function setStatus(status: string, target: string) :string {
    return (parseInt(status, 2) | parseInt(target, 2)).toString(2)
}

/**
 * 合并所有为 1 的状态
 * @param s
 * @example ["1000", "100"] => "1100" | ["1000", "1"] => "1001"
 */
function mergeStatus(s: Array<string>): string {
    let res = 0
    for (let i = 0; i < s.length; i++) {
        res = res | parseInt(s[i], 2)
    }
    return res.toString(2)
}

/**
 * 随机字符串
 */
function randString() :string {
    let num = Math.round(Math.random()*1000)
    return `${Date.now()}${num}`
}

/**
 * 深度拷贝Chessess
 * @param chesses
 */
function deepCopyChesses(chesses: Array<Chess>) :Array<Chess> {
    let resChesses: Array<Chess> = []
    for (let i = 0; i < chesses.length; i++) {
        let chess = new Chess(chesses[i].x, chesses[i].y, chesses[i].name, chesses[i].camp)
        if(!chesses[i].live) {
            chess.die()
        }
        resChesses.push(chess)
    }
    return resChesses
}

/**
 * 是否为json字符串
 */
function isJSON(str: string): boolean {
    try {
        JSON.parse(str)
        return true
    }catch (e) {
        return false
    }
}

/**
 * 数组转化为Position
 */
function arrayToPosition(arr:Array<number>) :Position {
    if(arr.length < 2) {
        return {} as Position
    }
    return {
        x: arr[0],
        y: arr[1]
    }
}

/**
 * 休眠
 */
function sleep(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay))
}

export {
    hasStatus, reverseStatus, mergeStatus,
    isSameStatus, resetStatus, setStatus,
    randString, deepCopyChesses, isJSON,
    arrayToPosition, sleep
}