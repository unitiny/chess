/**
 * 棋子属性 mounted获取
 */
const CHESS = {
    WIDTH: 30,
    HEIGHT: 30
}

/**
 * 棋子名称
 */
const CHESS_NAME = {
    SOLDIER: "SOLDIER",
    CANNON: "CANNON",
    CAR: "CAR",
    HORSE: "HORSE",
    ELEPHANT: "ELEPHANT",
    SCHOLAR: "SCHOLAR",
    KING: "KING",
}

/**
 * 棋子状态
 * 二进制
 * [悔棋][指令][选择][存活][阵营]
 */
const CHESS_STATUS = {
    BLOCK: "0", // 黑色阵营
    RED: "1", // 红色阵营
    LIVE: "10", // 存活
    CHOOSE: "100", // 选中
    ATTACK: "1000", // 0000 则为移动
    BACK: "10000" // 处于悔棋状态，可无视规则走法
}

/**
 * 棋子配置
 */
const CHESS_ATTRIBUTES = [
    {"x": 0, "y": 6, "name": CHESS_NAME.SOLDIER, "camp": CHESS_STATUS.RED},
    {"x": 2, "y": 6, "name": CHESS_NAME.SOLDIER, "camp": CHESS_STATUS.RED},
    {"x": 4, "y": 6, "name": CHESS_NAME.SOLDIER, "camp": CHESS_STATUS.RED},
    {"x": 6, "y": 6, "name": CHESS_NAME.SOLDIER, "camp": CHESS_STATUS.RED},
    {"x": 8, "y": 6, "name": CHESS_NAME.SOLDIER, "camp": CHESS_STATUS.RED},
    {"x": 1, "y": 7, "name": CHESS_NAME.CANNON, "camp": CHESS_STATUS.RED},
    {"x": 7, "y": 7, "name": CHESS_NAME.CANNON, "camp": CHESS_STATUS.RED},
    {"x": 0, "y": 9, "name": CHESS_NAME.CAR, "camp": CHESS_STATUS.RED},
    {"x": 8, "y": 9, "name": CHESS_NAME.CAR, "camp": CHESS_STATUS.RED},
    {"x": 1, "y": 9, "name": CHESS_NAME.HORSE, "camp": CHESS_STATUS.RED},
    {"x": 7, "y": 9, "name": CHESS_NAME.HORSE, "camp": CHESS_STATUS.RED},
    {"x": 2, "y": 9, "name": CHESS_NAME.ELEPHANT, "camp": CHESS_STATUS.RED},
    {"x": 6, "y": 9, "name": CHESS_NAME.ELEPHANT, "camp": CHESS_STATUS.RED},
    {"x": 3, "y": 9, "name": CHESS_NAME.SCHOLAR, "camp": CHESS_STATUS.RED},
    {"x": 5, "y": 9, "name": CHESS_NAME.SCHOLAR, "camp": CHESS_STATUS.RED},
    {"x": 4, "y": 9, "name": CHESS_NAME.KING, "camp": CHESS_STATUS.RED},

    {"x": 4, "y": 0, "name": CHESS_NAME.KING, "camp": CHESS_STATUS.BLOCK},
    {"x": 3, "y": 0, "name": CHESS_NAME.SCHOLAR, "camp": CHESS_STATUS.BLOCK},
    {"x": 5, "y": 0, "name": CHESS_NAME.SCHOLAR, "camp": CHESS_STATUS.BLOCK},
    {"x": 2, "y": 0, "name": CHESS_NAME.ELEPHANT, "camp": CHESS_STATUS.BLOCK},
    {"x": 6, "y": 0, "name": CHESS_NAME.ELEPHANT, "camp": CHESS_STATUS.BLOCK},
    {"x": 1, "y": 0, "name": CHESS_NAME.HORSE, "camp": CHESS_STATUS.BLOCK},
    {"x": 7, "y": 0, "name": CHESS_NAME.HORSE, "camp": CHESS_STATUS.BLOCK},
    {"x": 0, "y": 0, "name": CHESS_NAME.CAR, "camp": CHESS_STATUS.BLOCK},
    {"x": 8, "y": 0, "name": CHESS_NAME.CAR, "camp": CHESS_STATUS.BLOCK},
    {"x": 1, "y": 2, "name": CHESS_NAME.CANNON, "camp": CHESS_STATUS.BLOCK},
    {"x": 7, "y": 2, "name": CHESS_NAME.CANNON, "camp": CHESS_STATUS.BLOCK},

    {"x": 0, "y": 3, "name": CHESS_NAME.SOLDIER, "camp": CHESS_STATUS.BLOCK},
    {"x": 2, "y": 3, "name": CHESS_NAME.SOLDIER, "camp": CHESS_STATUS.BLOCK},
    {"x": 4, "y": 3, "name": CHESS_NAME.SOLDIER, "camp": CHESS_STATUS.BLOCK},
    {"x": 6, "y": 3, "name": CHESS_NAME.SOLDIER, "camp": CHESS_STATUS.BLOCK},
    {"x": 8, "y": 3, "name": CHESS_NAME.SOLDIER, "camp": CHESS_STATUS.BLOCK},
]

/**
 * 棋盘配置
 */
const CHESSBOARD = {
    LT_POS: [60, 60], // 棋盘左上角位置
    WIDTH: 100, // 棋盘每格宽度
    HEIGHT: 140, // 棋盘每格高度

    // 非常量，可变
    BLACK_BOTTOM: 0, // 黑色阵营底盘
    RED_BOTTOM: 9, // 红色阵营底盘
}

/**
 * 用户行为
 */
const USER_ACTION = {
    CHOOSE_CHESS: "CHOOSE_CHESS",
    MOVE_CHESS: "MOVE_CHESS",
    ATTACK_CHESS: "ATTACK_CHESS",
    NOT_ACTION: "NOT_ACTION"
}

/**
 * 首页面板属性
 */
const PANEL_ATTRIBUTE = [
    {"text": "双人对战", "url": "../index/index"},
    {"text": "自定义对局", "url": "../chess/index"},
]

/**
 * 双人面板属性
 */
const PANEL_DOUBLE_ATTRIBUTE = [
    {"text": "创建房间", "url": "../chess/index?type=0"},
    {"text": "加入房间", "url": "../chess/index?type=1"},
    {"text": "返回", "url": "../index/index"},
]

/**
 * 棋局菜单名称
 */
const MENU_NAME = {
    MENU: "menu",
    START: "start",
    CHAT: "chat"
}

/**
 * 开局面板设置
 */
const MODEL_ATTRIBUTE = [
    {"text": "红方：", "span": "棋手"},
    {"text": "黑方：", "span": "棋手"},
]

/**
 * 双人开局面板设置
 */
const MODEL_DOUBLE_ATTRIBUTE = [
    {"text": "己方：", "span": "先手"}
]

/**
 * 用户选择游戏配置
 * 二进制
 * [模式][房间身份][己方身份][对方身份][己方阵营]
 */
const MODE_STATUS = {
    BLOCK: "0", // 黑色阵营
    RED: "1", // 红色阵营
    OTHER_IDENTIFY: "10", // 对方身份 0 人机  1 玩家
    SELF_IDENTIFY: "100", // 对方身份 0 人机  1 玩家
    JOINER: "1000", // 身份 0 房间创建者  1 房间参与者
    PLAYER: "10000", // 模式 0 选择自定义 1 选择双人
}

/**
 * 棋局提示信息
 */
const TIP_MSG = {
    KILL_KING: "将军",
    KILLED_KING: "将被将军",
    NOT_BACK: "无法悔棋",
    CHECKMATE: "绝杀",
    NOT_CHECKMATE: "没有绝杀"
}

/**
 * 消息类型
 */
const MSG_TYPE = {
    NOT_ACTION: -1,
    CHAT: 0, // 聊天
    CHESS: 1, // 下棋
    BACK: 2, // 悔棋
}

/**
 * 机器名称
 */
const MACHINE_NAME = "000000"

/**
 * 发送给电脑指令
 */
const MACHINE_ACTION = {
    CLEAR: -2,
    BACK: -1,
    GO: 0
}

/**
 * 游戏进程
 */
const PROCESS = {
    START: 0,
    CHOOSE: 1,
    MOVE: 2,
    END: 3,
    BACK: 4
}

export {
    CHESS, CHESS_ATTRIBUTES, CHESS_STATUS, CHESSBOARD,
    USER_ACTION, CHESS_NAME, PANEL_ATTRIBUTE,
    MODEL_ATTRIBUTE, TIP_MSG, PANEL_DOUBLE_ATTRIBUTE,
    MSG_TYPE, MODE_STATUS, MODEL_DOUBLE_ATTRIBUTE, MACHINE_NAME,
    MACHINE_ACTION, MENU_NAME, PROCESS
}