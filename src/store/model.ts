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
    Move
}

type Message = {
    action: number
    message: string
    name?: string
    machine?: boolean
}

type MachineMsg = {
    room : number
    start: Array<number>
    end: Array<number>
}

export {
    Objects,
    Position,
    Move,
    Step,
    Message
}