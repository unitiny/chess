import {CHESS_NAME, CHESS_STATUS, CHESSBOARD, USER_ACTION, TIP_MSG, CHESS} from "@/config";
import {Cannon, Car, Elephant, Horse, King, Scholar, Soldier} from "@/store/rules";
import * as common from "@/store/common";
import {Objects} from "@/store/model";
import ERROR from "@/config/error";
import store from "@/store";

let id = 0

class Chess {
    id: number
    x: number
    y: number
    name: string
    status: string

    constructor(x, y, name, camp) {
        this.id = id++ % 32
        this.x = x
        this.y = y
        this.name = name
        this.status = common.mergeStatus([CHESS_STATUS.LIVE, camp])
    }

    get style() {
        let pos_x = `${CHESSBOARD.LT_POS[0] - CHESS.WIDTH / 2 + CHESSBOARD.WIDTH * this.x}rpx`
        let pos_y = `${CHESSBOARD.LT_POS[1] - CHESS.HEIGHT / 2 + CHESSBOARD.HEIGHT * this.y}rpx`
        let width = `${CHESS.WIDTH}rpx`
        let height = `${CHESS.HEIGHT}rpx`
        return `left:${pos_x};top: ${pos_y};width: ${width}; height: ${height}`
    }

    get hiddenBox() {
        return !this.isChoose()
    }

    get path() {
        let name = this.name.toLowerCase()
        if (common.hasStatus(this.status, "1")) {
            name = `red-${name}`
        }

        return {"chess": `../../static/img/${name}.png`}
    }

    get camp() {
        return this.status[this.status.length - 1]
    }

    get live() {
        return common.hasStatus(this.status, "10")
    }

    get bottom() {
        return common.hasStatus(this.status, "1") ? CHESSBOARD.RED_BOTTOM : CHESSBOARD.BLACK_BOTTOM
    }

    isChoose() {
        return common.hasStatus(this.status, "100")
    }

    choose() {
        this.status = common.reverseStatus(this.status, "100")
    }

    notChoose() {
        this.status = common.resetStatus(this.status, "100")
    }

    attack() {
        this.status = common.setStatus(this.status, "1000")
    }

    move() {
        this.status = common.resetStatus(this.status, "1000")
    }

    back() {
        return common.hasStatus(this.status, "10000")
    }

    die() {
        this.status = common.resetStatus(this.status, "10")
    }

    alive() {
        this.status = common.setStatus(this.status, "10")
    }

    changePos(chesses: Array<Chess>, pos: Array<number>) {
        if (!this.isChoose()) {
            throw new Error(ERROR.UNCHOOSE_CHESS)
        }

        if (!this.back()) {
            this.checkRule(chesses, [this.x, this.y], pos, this.bottom)
        }

        this.x = pos[0]
        this.y = pos[1]

        if (!this.back()) {
            this.checkKing(chesses)
        }
    }

    // 是否符合移动规则
    checkRule(chesses: Array<Chess>, start: Array<number>, target: Array<number>, bottom: number) {
        let action = common.hasStatus(this.status, "1000") ?
            USER_ACTION.ATTACK_CHESS : USER_ACTION.MOVE_CHESS

        switch (this.name) {
            case CHESS_NAME.SOLDIER:
                Soldier(start, target, bottom)
                break;
            case CHESS_NAME.CANNON:
                Cannon(chesses, start, target, bottom, action)
                break;
            case CHESS_NAME.CAR:
                Car(chesses, start, target, bottom, action)
                break;
            case CHESS_NAME.HORSE:
                Horse(chesses, start, target, bottom)
                break;
            case CHESS_NAME.ELEPHANT:
                Elephant(chesses, start, target, bottom)
                break;
            case CHESS_NAME.SCHOLAR:
                Scholar(start, target, bottom)
                break;
            case CHESS_NAME.KING:
                King(chesses, start, target, bottom)
                break;
        }
    }

    // 是否将军与被将军
    checkKing(chesses: Array<Chess>) {
        // 获取双方阵容将军位置
        let king: Objects = {}
        let selfKing: Objects = {}
        for (const chess of chesses) {
            if (chess.name === CHESS_NAME.KING) {
                chess.camp !== this.camp ? king = chess : selfKing = chess
            }
        }

        // 看己方或对方棋子能够合法攻击到将军位置
        let isKing = false, isSelfKing = false, isAttack = false
        for (const chess of chesses) {
            if (!chess.live) {
                continue
            }

            // 记录已处于攻击状态的id，以便复原状态
            if (common.hasStatus(chess.status, "1000")) {
                isAttack = true
            }

            // 有错则停止轮下一位
            try {
                chess.attack()
                if (chess.camp === this.camp) {
                    chess.checkRule(chesses, [chess.x, chess.y], [king.x, king.y], chess.bottom)
                    isKing = true
                } else {
                    chess.checkRule(chesses, [chess.x, chess.y], [selfKing.x, selfKing.y], chess.bottom)
                    isSelfKing = true
                }
            } catch (e) {
            } finally {
                isAttack ? chess.attack() : chess.move()
                isAttack = false
            }
        }

        if (isSelfKing) {
            console.log('被将军')
            store.commit("updateTip", TIP_MSG.KILLED_KING)
        } else if (isKing) {
            console.log('将军')
            store.commit("updateTip", TIP_MSG.KILL_KING)
        }
    }
}

export default Chess