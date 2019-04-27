import {Entity} from "./Entity"
import {Player} from "./Player"

export abstract class Monster extends Entity {
    constructor(protected player: Player, x: number, y: number, r: number) {
        super(x, y, r)
    }
}
