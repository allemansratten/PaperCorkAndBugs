import {CircleHitbox} from "./CircleHitbox"
import {Entity} from "./Entity"

export class Hitbox {

    static checkCollision(a: Entity, b: Entity): boolean {
        if (a.hitbox instanceof CircleHitbox && b.hitbox instanceof CircleHitbox) {
            return a.pos.clone().subtract(b.pos).length() < (a.hitbox as CircleHitbox).r + (b.hitbox as CircleHitbox).r
        }
        return false
    }
}
