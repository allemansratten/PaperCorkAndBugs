import {Vector} from "vector2d"

export class DirectionKeyState {

    public states : [boolean, boolean, boolean, boolean] = [false, false, false, false];

    // up, right, down, left
    constructor(public keys : [string, string, string, string]) {
    }

    handleKey(key: string, pressed: boolean) {
        for (let i = 0; i < 4; i++) {
            if (key === this.keys[i]) {
                this.states[i] = pressed
            }
        }
    }

    getDirection() : Vector {
        let res : Vector = new Vector(0, 0)
        const deltas = [[0, -1], [1, 0], [0, 1], [-1, 0]]
        for (let i = 0; i < 4; i++) {
            if (this.states[i]) {
                res.x += deltas[i][0]
                res.y += deltas[i][1]
            }
        }
        return res
    }
}