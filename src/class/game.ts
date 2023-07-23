import {Objects, ProcessTime, Step} from "@/store/model";
import {computed, ref} from "vue";
import store from "@/store";

class Game {
    curIndex: number = 0            // 当前棋子索引
    curCamp: number = 2             // 当前轮到阵营 0 黑色  1 红色
    curStep: number = 0             // 当前步数
    process: number = 0             // 游戏进程 0开始，1选择，2移动，3结束
    processTime: ProcessTime = {} as ProcessTime    // 各进程的触发时间
    record: Array<Objects> = []     // 记录棋局
    close: boolean = false          // 关闭棋局

    constructor(curIndex: number, curCamp: number) {
        this.curIndex = curIndex
        this.curCamp = curCamp
    }

    get camp() {
        return this.curCamp
    }

    get index() {
        return this.curIndex
    }

    // 玩家选择模式
    get mode() {
        return computed(() => store.state.mode)
    }

    reset(camp, index, step) {
        this.curCamp = camp
        this.curIndex = index
        this.curStep = step
        this.record = []
    }

    setProcess(flag: number, time: number) {
        this.process = flag
        if (flag === 0) {
            this.processTime.start = time
        } else if (flag === 1) {
            this.processTime.choose = time
        } else if (flag === 2) {
            this.processTime.move = time
        } else if (flag === 3) {
            this.processTime.end = time
        } else if (flag === 4) {
            this.processTime.back = time
        }
    }

    push(step: Objects) {
        this.record.push(step)
        this.curStep = this.record.length
    }

    pop() {
        let len = this.record.length
        if (len === 0) {
            return {}
        }

        let step = this.record[len - 1]
        this.record.pop()
        this.curStep = this.record.length
        return step
    }
}

export default Game