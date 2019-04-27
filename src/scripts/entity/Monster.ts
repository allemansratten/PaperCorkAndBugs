import {Entity} from "./Entity"
import {Player} from "./Player"
import {Vector} from "vector2d"
import {CircleHitbox} from "./CircleHitbox"

export abstract class Monster extends Entity {

    constructor(protected player: Player, pos: Vector, r: number, protected hp: number) {
        super(pos, r, new CircleHitbox(r))
    }

    readonly friendly: boolean = false

    alive(): boolean {
        return this.hp > 0
    }
}
