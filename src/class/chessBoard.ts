import {CHESS, CHESSBOARD} from "@/config";
import {Objects} from "@/store/model";
import store from "@/store";

class ChessBoard {
    width: number
    height: number
    lt_pos: Array<number>
    landing: Objects

    constructor() {
        this.width = CHESSBOARD.WIDTH
        this.height = CHESSBOARD.HEIGHT
        this.lt_pos = CHESSBOARD.LT_POS
        this.landing = {
            hidden: true,
            blueBox: "blueBox.png",
            redBox:"redBox.png",
            box: "redBox.png",
            style: ""
        }
    }

    getLanding(pos: Array<number>) {
        this.landing.hidden = false
        let pos_x = `${CHESSBOARD.LT_POS[0] - CHESS.WIDTH/2 + CHESSBOARD.WIDTH * pos[0]}rpx`
        let pos_y = `${CHESSBOARD.LT_POS[1] - CHESS.HEIGHT/2 + CHESSBOARD.HEIGHT * pos[1] + 10}rpx`
        this.landing.style = `left:${pos_x};top: ${pos_y}`
    }

    // 获取位置
    getPos(e) {
        let {x, y} = e.detail
        // console.log(x, y)
        x = x * store.state.ratio
        y = y * store.state.ratio

        const width = CHESSBOARD.WIDTH
        const height = CHESSBOARD.HEIGHT
        const left = CHESSBOARD.LT_POS[0]
        const top = CHESSBOARD.LT_POS[1]

        let row = Math.abs(Math.round((x - left) / width))
        let column = Math.abs(Math.round((y - top) / height))
        row = row >= 9 ? 8 : row
        column = column >= 10 ? 9 : column

        // 点击效果及复原
        let pos = [row, column]
        this.getLanding(pos)
        setTimeout(() => {
            this.landing.hidden = true
        }, 200)

        return pos
    }
}

export default ChessBoard