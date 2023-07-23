type Objects = {
    [propName: string]: any
}

type Position = {
    x: number
    y: number
}

type Move = {
    start: Position
    end: Position
}

type Step = {
    index: number
    move: Move
}

type Message = {
    action: number // 与MSG_TYPE关联
    message: string
    name?: string
    machine?: boolean
}

type MachineMsg = {
    id : number
    action: number // 与MSG_TYPE关联
    room: string
    start: Position
    end: Position
}

type ProcessTime = {
    start: number
    choose: number
    move: number
    end: number
    back: number
}

export type {
    Objects,
    Position,
    Move,
    Step,
    Message,
    MachineMsg,
    ProcessTime
}