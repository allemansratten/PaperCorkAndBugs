import {CircleHitbox} from "./CircleHitbox"
import {Entity} from "./Entity"
import {hypot} from "../Util"

export class Hitbox {

    static checkCollision(a: Entity, b: Entity): boolean {
        if (a.hitbox instanceof CircleHitbox && b.hitbox instanceof CircleHitbox) {
            return hypot(a.pos.x - b.pos.x, a.pos.y - b.pos.y) < (a.hitbox as CircleHitbox).r + (b.hitbox as CircleHitbox).r
        }
        return false
    }
}
