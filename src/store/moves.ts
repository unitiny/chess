import * as rules from "./rules"
import * as common from "./common"
import {Move, Position, Step} from "./model"
import Chess from "@/class/chess";
import {isSameStatus} from "./common";
import {CHESS_NAME} from "@/config";
import {ruleFunc} from "./rules";

// 各棋子所有走法
interface Moves {
    (chesses: Array<Chess>, index: number): Array<Move>
}

type StepFunc = {
    [propName: string]: Moves
}

let stepFunc: StepFunc = {}

function init() {
    stepFunc[CHESS_NAME.SOLDIER] = SoldierMoves
    stepFunc[CHESS_NAME.CANNON] = CannonMoves
    stepFunc[CHESS_NAME.CAR] = CarMoves
    stepFunc[CHESS_NAME.HORSE] = HorseMoves
    stepFunc[CHESS_NAME.ELEPHANT] = ElephantMoves
    stepFunc[CHESS_NAME.SCHOLAR] = ScholarMoves
    stepFunc[CHESS_NAME.KING] = KingMoves
}

init()

function toMove(arr1: Array<number>, arr2: Array<number>): Move {
    return {
        start: {
            x: arr1[0],
            y: arr1[1],
        },
        end: {
            x: arr2[0],
            y: arr2[1],
        }
    }
}

// 根据位置获取棋子索引
function getChessByPos(chesses: Array<Chess>, pos: Array<number>): number {
    for (let k = 0; k < chesses.length; k++) {
        let v = chesses[k]
        if (v.x === pos[0] && v.y === pos[1] && v.live) {
            return k
        }
    }
    return -1
}

function SoldierMoves(chesses: Array<Chess>, index: number): Array<Move> {
    let soldier = chesses[index]
    let offsets = [[1, 0], [-1, 0], [0, 1], [0, -1]]

    let legalPos = []
    for (let i = 0; i < offsets.length; i++) {
        let offset = offsets[i]
        let pos = [soldier.x + offset[0], soldier.y + offset[1]]

        let k = getChessByPos(chesses, pos)
        if (k !== -1) {
            let chess = chesses[k]
            if (common.isSameStatus(chess.status, soldier.camp)) {
                continue // 同阵营则不能走
            }
        }
        legalPos.push(pos)
    }

    let resMoves = []
    let start = [soldier.x, soldier.y]
    for (let i = 0; i < legalPos.length; i++) {
        let target = legalPos[i]
        try {
            // 无报错则表示合法走法
            ruleFunc[soldier.name](chesses, start, target, soldier.bottom)
            let move: Move = {
                start: {x: soldier.x, y: soldier.y},
                end: {x: target[0], y: target[1]}
            }
            resMoves.push(move)
        } catch (err) {

        }
    }
    return resMoves
}

function CannonMoves(chesses: Array<Chess>, index: number): Array<Move> {
    let cannon = chesses[index]
    let resMoves: Array<Move> = []
    let start = [cannon.x, cannon.y]

    // 上检索
    let isPrevent = false
    for (let i = cannon.y - 1; i >= 0; i--) {
        let pos = [cannon.x, i]

        if (!isPrevent) {
            if (getChessByPos(chesses, pos) === -1) { // 未遮挡且有空位
                let move: Move = toMove(start, pos)
                resMoves.push(move)
            } else {
                isPrevent = true
            }
        } else {
            let k = getChessByPos(chesses, pos)
            if (k !== -1) {
                if (!common.isSameStatus(chesses[k].status, cannon.camp)) {
                    // 遮挡且遇到敌方棋子
                    let move: Move = toMove(start, pos)
                    resMoves.push(move)
                }
                break
            }
        }
    }

    // 下检索
    isPrevent = false
    for (let i = cannon.y + 1; i <= 9; i++) {
        let pos = [cannon.x, i]

        if (!isPrevent) {
            if (getChessByPos(chesses, pos) === -1) { // 未遮挡且有空位
                let move: Move = toMove(start, pos)
                resMoves.push(move)
            } else {
                isPrevent = true
            }
        } else {
            let k = getChessByPos(chesses, pos)
            if (k !== -1) {
                if (!common.isSameStatus(chesses[k].status, cannon.camp)) {
                    // 遮挡且遇到敌方棋子
                    let move: Move = toMove(start, pos)
                    resMoves.push(move)
                }
                break
            }
        }
    }

    // 左检索
    isPrevent = false
    for (let i = cannon.x - 1; i >= 0; i--) {
        let pos = [i, cannon.y]

        if (!isPrevent) {
            if (getChessByPos(chesses, pos) === -1) { // 未遮挡且有空位
                let move: Move = toMove(start, pos)
                resMoves.push(move)
            } else {
                isPrevent = true
            }
        } else {
            let k = getChessByPos(chesses, pos)
            if (k !== -1) {
                if (!common.isSameStatus(chesses[k].status, cannon.camp)) {
                    // 遮挡且遇到敌方棋子
                    let move: Move = toMove(start, pos)
                    resMoves.push(move)
                }
                break
            }
        }
    }

    // 右检索
    isPrevent = false
    for (let i = cannon.x + 1; i <= 8; i++) {
        let pos = [i, cannon.y]

        if (!isPrevent) {
            if (getChessByPos(chesses, pos) === -1) { // 未遮挡且有空位
                let move: Move = toMove(start, pos)
                resMoves.push(move)
            } else {
                isPrevent = true
            }
        } else {
            let k = getChessByPos(chesses, pos)
            if (k !== -1) {
                if (!common.isSameStatus(chesses[k].status, cannon.camp)) {
                    // 遮挡且遇到敌方棋子
                    let move: Move = toMove(start, pos)
                    resMoves.push(move)
                }
                break
            }
        }
    }
    return resMoves
}

function CarMoves(chesses: Array<Chess>, index: number): Array<Move> {
    let car = chesses[index]
    let resMoves: Array<Move> = []
    let start = [car.x, car.y]

    // 上检索
    for (let i = car.y - 1; i >= 0; i--) {
        let pos = [car.x, i]
        let k = getChessByPos(chesses, pos)
        if (k !== -1) {
            if (!common.isSameStatus(chesses[k].status, car.camp)) {
                let move: Move = toMove(start, pos)
                resMoves.push(move)
            }
            break // 为己方棋子直接结束
        }
        let move: Move = toMove(start, pos)
        resMoves.push(move)
    }

    // 下检索
    for (let i = car.y + 1; i <= 9; i++) {
        let pos = [car.x, i]
        let k = getChessByPos(chesses, pos)
        if (k !== -1) {
            if (!common.isSameStatus(chesses[k].status, car.camp)) {
                let move: Move = toMove(start, pos)
                resMoves.push(move)
            }
            break // 为己方棋子直接结束
        }
        let move: Move = toMove(start, pos)
        resMoves.push(move)
    }

    // 左检索
    for (let i = car.x - 1; i >= 0; i--) {
        let pos = [i, car.y]
        let k = getChessByPos(chesses, pos)
        if (k !== -1) {
            if (!common.isSameStatus(chesses[k].status, car.camp)) {
                let move: Move = toMove(start, pos)
                resMoves.push(move)
            }
            break // 为己方棋子直接结束
        }
        let move: Move = toMove(start, pos)
        resMoves.push(move)
    }

    // 右检索
    for (let i = car.x + 1; i <= 8; i++) {
        let pos = [i, car.y]
        let k = getChessByPos(chesses, pos)
        if (k !== -1) {
            if (!common.isSameStatus(chesses[k].status, car.camp)) {
                let move: Move = toMove(start, pos)
                resMoves.push(move)
            }
            break // 为己方棋子直接结束
        }
        let move: Move = toMove(start, pos)
        resMoves.push(move)
    }
    return resMoves
}

function HorseMoves(chesses: Array<Chess>, index: number): Array<Move> {
    let horse = chesses[index]
    let offsets = [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1],]

    let legalPos = []
    for (let i = 0; i < offsets.length; i++) {
        let offset = offsets[i]
        let pos = [horse.x + offset[0], horse.y + offset[1]]

        let k = getChessByPos(chesses, pos)
        if (k !== -1) {
            let chess = chesses[k]
            if (common.isSameStatus(chess.status, horse.camp)) {
                continue // 同阵营则不能走
            }
        }
        legalPos.push(pos)
    }

    let resMoves = []
    let start = [horse.x, horse.y]
    for (let i = 0; i < legalPos.length; i++) {
        let target = legalPos[i]
        try {
            // 无报错则表示合法走法
            ruleFunc[horse.name](chesses, start, target, horse.bottom)
            let move: Move = {
                start: {x: horse.x, y: horse.y},
                end: {x: target[0], y: target[1]}
            }
            resMoves.push(move)
        } catch (err) {

        }
    }
    return resMoves
}

function ElephantMoves(chesses: Array<Chess>, index: number): Array<Move> {
    let elephant = chesses[index]
    let offsets = [[2, 2], [2, -2], [-2, 2], [-2, -2]]

    let legalPos = []
    for (let i = 0; i < offsets.length; i++) {
        let offset = offsets[i]
        let pos = [elephant.x + offset[0], elephant.y + offset[1]]

        let k = getChessByPos(chesses, pos)
        if (k !== -1) {
            let chess = chesses[k]
            if (common.isSameStatus(chess.status, elephant.camp)) {
                continue // 同阵营则不能走
            }
        }
        legalPos.push(pos)
    }

    let resMoves = []
    let start = [elephant.x, elephant.y]
    for (let i = 0; i < legalPos.length; i++) {
        let target = legalPos[i]
        try {
            // 无报错则表示合法走法
            ruleFunc[elephant.name](chesses, start, target, elephant.bottom)
            let move: Move = {
                start: {x: elephant.x, y: elephant.y},
                end: {x: target[0], y: target[1]}
            }
            resMoves.push(move)
        } catch (err) {

        }
    }
    return resMoves
}

function ScholarMoves(chesses: Array<Chess>, index: number): Array<Move> {
    let scholar = chesses[index]
    let offsets = [[1, 1], [-1, 1], [1, -1], [-1, -1]]

    let legalPos = []
    for (let i = 0; i < offsets.length; i++) {
        let offset = offsets[i]
        let pos = [scholar.x + offset[0], scholar.y + offset[1]]

        if (pos[1] < 0 || pos[1] > 9) {
            continue // 越界
        }

        let k = getChessByPos(chesses, pos)
        if (k !== -1) {
            let chess = chesses[k]
            if (common.isSameStatus(chess.status, scholar.camp)) {
                continue // 同阵营则不能走
            }
        }
        legalPos.push(pos)
    }

    let resMoves = []
    let start = [scholar.x, scholar.y]
    for (let i = 0; i < legalPos.length; i++) {
        let target = legalPos[i]
        try {
            // 无报错则表示合法走法
            ruleFunc[scholar.name](chesses, start, target, scholar.bottom)
            let move: Move = {
                start: {x: scholar.x, y: scholar.y},
                end: {x: target[0], y: target[1]}
            }
            resMoves.push(move)
        } catch (err) {

        }
    }
    return resMoves
}

function KingMoves(chesses: Array<Chess>, index: number): Array<Move> {
    let king = chesses[index]
    let offsets = [[1, 0], [-1, 0], [0, 1], [0, -1]]

    let legalPos = [] // 合法走法
    for (let i = 0; i < offsets.length; i++) {
        let offset = offsets[i]
        let pos = [king.x + offset[0], king.y + offset[1]]

        let k = getChessByPos(chesses, pos)
        if (k !== -1) {
            let chess = chesses[k]
            if (common.isSameStatus(chess.status, king.camp)) {
                continue // 同阵营则不能走
            }
        }
        legalPos.push(pos)
    }

    // 加入攻击对方将军位置
    for (let i = 0; i < chesses.length; i++) {
        if (chesses[i].name === CHESS_NAME.KING &&
            !common.isSameStatus(chesses[i].status, king.camp)) {
            let pos = [chesses[i].x, chesses[i].y]
            legalPos.push(pos)
        }
    }


    let resMoves = []
    let start = [king.x, king.y]
    for (let i = 0; i < legalPos.length; i++) {
        let target = legalPos[i]
        try {
            // 无报错则表示合法走法
            ruleFunc[king.name](chesses, start, target, king.bottom)
            let move: Move = {
                start: {x: king.x, y: king.y},
                end: {x: target[0], y: target[1]}
            }
            resMoves.push(move)
        } catch (err) {

        }
    }
    return resMoves
}

// 获取阵营所有走法
function GetMoves(chesses: Array<Chess>, camp: number): Array<Step> {
    let resStep: Array<Step> = []
    for (let i = 0; i < chesses.length; i++) {
        let chess = chesses[i]

        if (!chess.live) {
            continue
        }

        if (isSameStatus(chess.status, camp.toString())) {
            let moves = stepFunc[chess.name](chesses, i)
            for (let j = 0; j < moves.length; j++) {
                let step: Step = {
                    index: i,
                    move: moves[j],
                }
                resStep.push(step)
            }
        }
    }

    // console.log(resStep)
    return resStep
}

// 判断是否绝杀
function isCheckmate(chesses: Array<Chess>, camp: number): boolean {
    let copyChesses = common.deepCopyChesses(chesses)
    let steps = GetMoves(copyChesses, camp)
    for (let i = 0; i < steps.length; i++) {
        let k = move(copyChesses, steps[i])
        if (!isCheckKing(copyChesses, camp)) {
            return false
        }
        back(copyChesses, steps[i], k)
    }
    return true
}

// 移动
function move(chesses: Array<Chess>, step: Step): number {
    // 获取被吃棋子的索引
    let pos = [step.move.end.x, step.move.end.y]
    let die = getChessByPos(chesses, pos)

    chesses[step.index].x = step.move.end.x
    chesses[step.index].y = step.move.end.y

    if (die !== -1) {
        chesses[die].die()
    }
    return die
}

// 悔棋
function back(chesses: Array<Chess>, step: Step, die: number) {
    chesses[step.index].x = step.move.start.x
    chesses[step.index].y = step.move.start.y

    if (die !== -1) {
        chesses[die].alive()
    }
}

// 判断是否被将军
function isCheckKing(chesses: Array<Chess>, camp: number): boolean {
    // 获取将军位置
    let kingPos: Position = {
        x: 0,
        y: 0
    }
    for (let i = 0; i < chesses.length; i++) {
        if (chesses[i].name === CHESS_NAME.KING &&
            isSameStatus(chesses[i].status, camp.toString())) {
            kingPos.x = chesses[i].x
            kingPos.y = chesses[i].y
        }
    }
    // 遍历对方所有走法，看是否能攻击到将军位置
    for (let i = 0; i < chesses.length; i++) {
        if (!chesses[i].live) {
            continue
        }
        if (!isSameStatus(chesses[i].status, camp.toString())) {
            let steps = stepFunc[chesses[i].name](chesses, i)
            for (let j = 0; j < steps.length; j++) {
                if (JSON.stringify(steps[j].end) === JSON.stringify(kingPos)) {
                    return true
                }
            }
        }
    }
    return false
}

export {
    stepFunc,
    GetMoves,
    isCheckmate
}