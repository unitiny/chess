import ERROR from "@/config/error";
import Chess from "@/class/chess";
import {CHESS_NAME, USER_ACTION} from "@/config";

/**
 * 校验所有着陆点
 * @param offset
 * @param start
 * @param target
 */
function regOffset(offset: Array<Array<number>>, start, target: Array<number>): boolean {
    for (let i = 0; i < offset.length; i++) {
        let x = start[0] + offset[i][0]
        let y = start[1] + offset[i][1]
        if (x >= 0 && x <= 8 && y >= 0 && y <= 9) {
            if (target.join() === `${x},${y}`) {
                return true
            }
        }
    }
    return false
}

/**
 * 统计始末间路径其他棋子数目
 * @param chesses
 * @param start
 * @param target
 */
function pathChessNum(chesses: Array<Chess>, start: Array<number>, target: Array<number>): number {
    let column = target[0] === start[0]
    let row = target[1] === start[1]

    let num = 0
    for (const chess of chesses) {
        if (!chess.live) {
            continue
        }

        if (chess.x === start[0] && column) {           // 竖着走
            if (target[1] > chess.y && chess.y > start[1] ||
                target[1] < chess.y && chess.y < start[1]) {
                num++
            }
        } else if (chess.y === start[1] && row) { // 横着走
            if (target[0] > chess.x && chess.x > start[0] ||
                target[0] < chess.x && chess.x < start[0]) {
                num++
            }
        }
    }
    return num
}

/**
 * 兵规则
 * @param start 起始位置
 * @param target 目标位置
 * @param bottom 底部位置
 */
function Soldier(start: Array<number>, target: Array<number>, bottom: number) {
    let startOffset = Math.abs(start[1] - bottom)
    let targetOffset = Math.abs(target[1] - bottom)

    let offsetX = Math.abs(start[0] - target[0])
    let offsetY = Math.abs(start[1] - target[1])

    if (startOffset <= 4) {
        // 处于己方地盘
        if (target[0] !== start[0] || targetOffset !== startOffset + 1) {
            throw new Error(ERROR.TARGET_POS_ERROR)
        }
    } else {
        // 已过河
        if (targetOffset < startOffset ||
            offsetX > 1 || offsetY > 1 ||
            offsetX === 1 && offsetY == 1 ||
            targetOffset > 9) {
            throw new Error(ERROR.TARGET_POS_ERROR)
        }
    }
}

/**
 * 炮规则
 * @param chesses
 * @param start 起始位置
 * @param target 目标位置
 * @param bottom 底部位置
 * @param action 指令
 *
 */
function Cannon(chesses: Array<Chess>, start: Array<number>, target: Array<number>, bottom: number, action: string) {
    let row = target[1] === start[1]
    let column = target[0] === start[0]

    // 目标位置是否错误
    if (!(column || row)) {
        throw new Error(ERROR.TARGET_POS_ERROR)
    }

    let num = pathChessNum(chesses, start, target) // 统计起始与目标位置中间的棋子数
    if (action === USER_ACTION.ATTACK_CHESS && num !== 1) {
        // 攻击其他棋子
        throw new Error(ERROR.NOT_WAY_ATTACK)
    } else if (action === USER_ACTION.MOVE_CHESS && num !== 0) {
        // 移动
        throw new Error(ERROR.POS_LIMITED)
    }
}

/**
 * 车规则
 * @param chesses
 * @param start 起始位置
 * @param target 目标位置
 * @param bottom 底部位置
 * @param action 指令
 */
function Car(chesses: Array<Chess>, start: Array<number>, target: Array<number>, bottom: number, action: string) {
    let column = target[0] === start[0]
    let row = target[1] === start[1]

    // 目标位置是否错误
    if (!(column || row)) {
        throw new Error(ERROR.TARGET_POS_ERROR)
    }

    let num = pathChessNum(chesses, start, target)
    if (num !== 0) {
        throw new Error(ERROR.POS_LIMITED)
    }
}

/**
 * 马规则
 * @param chesses
 * @param start 起始位置
 * @param target 目标位置
 * @param bottom 底部位置
 */
function Horse(chesses: Array<Chess>, start: Array<number>, target: Array<number>, bottom: number) {
    let offset = [[2, 1], [-2, 1], [2, -1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]

    if (!regOffset(offset, start, target)) {
        throw new Error(ERROR.TARGET_POS_ERROR)
    }

    let foot = []
    // 东南西北获取马脚
    if (target[0] === start[0] + 2 && (target[1] === start[1] + 1 || target[1] === start[1] - 1)) {
        foot = [start[0] + 1, start[1]]
    } else if (target[1] === start[1] - 2 && (target[0] === start[0] + 1 || target[0] === start[0] - 1)) {
        foot = [start[0], start[1] - 1]
    } else if (target[0] === start[0] - 2 && (target[1] === start[1] + 1 || target[1] === start[1] - 1)) {
        foot = [start[0] - 1, start[1]]
    } else {
        foot = [start[0], start[1] + 1]
    }

    for (const chess of chesses) {
        if (chess.live && chess.x === foot[0] && chess.y === foot[1]) {
            throw new Error(ERROR.NOT_WAY_ATTACK)
        }
    }
}

/**
 * 象规则
 * @param chesses
 * @param start 起始位置
 * @param target 目标位置
 * @param bottom 底部位置
 */
function Elephant(chesses: Array<Chess>, start: Array<number>, target: Array<number>, bottom: number) {
    let offset = [[2, 2], [2, -2], [-2, 2], [-2, -2]]
    let targetOffset = Math.abs(target[1] - bottom)

    if (!regOffset(offset, start, target) || targetOffset > 4) {
        throw new Error(ERROR.TARGET_POS_ERROR)
    }

    // 获取象脚
    let foot = []
    if (target[0] === start[0] + 2 && target[1] === start[1] + 2) {
        foot = [start[0] + 1, start[1] + 1]
    } else if (target[0] === start[0] + 2 && target[1] === start[1] - 2) {
        foot = [start[0] + 1, start[1] - 1]
    } else if (target[0] === start[0] - 2 && target[1] === start[1] + 2) {
        foot = [start[0] - 1, start[1] + 1]
    } else {
        foot = [start[0] - 1, start[1] - 1]
    }

    for (const chess of chesses) {
        if (chess.live && chess.x === foot[0] && chess.y === foot[1]) {
            throw new Error(ERROR.NOT_WAY_ATTACK)
        }
    }
}

/**
 * 士规则
 * @param start 起始位置
 * @param target 目标位置
 * @param bottom 底部位置
 */
function Scholar(start: Array<number>, target: Array<number>, bottom: number) {
    let startOffset = Math.abs(start[1] - bottom)
    let targetOffset = Math.abs(target[1] - bottom)

    let res = false
    if (startOffset === 0 || startOffset === 2) {
        if (target[0] !== 4 || targetOffset !== 1) {
            res = true
        }
    } else if (startOffset === 1) {
        let offset = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
        if (!regOffset(offset, start, target)) {
            res = true
        }
    } else {
        res = true // 脱离井字区域
    }

    if (res) {
        throw new Error(ERROR.TARGET_POS_ERROR)
    }
}

/**
 * 将规则
 * @param chesses
 * @param start 起始位置
 * @param target 目标位置
 * @param bottom 底部位置
 */
function King(chesses: Array<Chess>, start: Array<number>, target: Array<number>, bottom: number) {
    let offset = [[1, 0], [0, 1], [-1, 0], [0, -1]]
    let targetOffset = Math.abs(target[1] - bottom)

    // 攻击对方将军
    for (const chess of chesses) {
        if (chess.live &&
            chess.name === CHESS_NAME.KING &&
            chess.x === target[0] &&
            chess.y === target[1] &&
            start[0] === target[0] &&
            pathChessNum(chesses, start, target) === 0) {
            return
        }
    }

    if (!regOffset(offset, start, target) ||
        targetOffset > 2 || target[0] < 3 || target[0] > 5) {
        throw new Error(ERROR.TARGET_POS_ERROR)
    }
}


export {
    Soldier, Cannon, Car, Horse, Elephant, Scholar, King
}