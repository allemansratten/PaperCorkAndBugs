import {Entity} from "./Entity"
import {Player} from "./Player"
import {Vector} from "vector2d"
import {CircleHitbox} from "./CircleHitbox"

export abstract class Projectile extends Entity {

    constructor(protected player: Player, pos: Vector, r: number, public friendly: boolean) {
        super(pos, r, new CircleHitbox(r))
    }
}
