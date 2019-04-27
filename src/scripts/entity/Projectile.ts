import {Entity} from "./Entity"
import {Level} from "../Level"
import {Player} from "./Player"
import {Vector} from "vector2d"
import {CircleHitbox} from "./CircleHitbox"

export class Projectile extends Entity {

    constructor(private player: Player, pos: Vector, r: number, public friendly: boolean) {
        super(pos, r, new CircleHitbox(r))
    }

    step(seconds: number, level: Level): boolean {
        return true
    }

    collideWith(entity: Entity): void {

    }
}
