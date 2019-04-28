import {Entity} from "./Entity"
import {Level} from "../Level"
import {Player} from "./Player"
import {clamp} from "../Util"
import {Vector} from "vector2d"

export abstract class BodyPart extends Entity {
    friendly: boolean = false
    pickedUp: boolean = false
    magnet: Player = null
    speed: Vector = new Vector(0, 0)
    private static readonly MAX_SPEED = 620
    private static readonly ACCELERATION = 2000

    collideWith(entity: Entity): void {
        if (entity instanceof Player) this.pickedUp = true
    }

    step(seconds: number, level: Level): boolean {
        if(this.magnet != null) {
            let direction: Vector = this.magnet.pos.clone().subtract(this.pos) as Vector
            if (direction.length() !== 0) {
                direction.normalise().mulS(BodyPart.ACCELERATION * seconds)
            }
            this.speed.add(direction)
            const length2 = clamp(this.speed.magnitude(), 0, BodyPart.MAX_SPEED)

            if (this.speed.length() > 1e-6) {
                this.speed = this.speed.normalise().mulS(length2)
            } else {
                // Avoid division by zero
                this.speed.setAxes(0, 0)
            }

            this.pos.add(this.speed.clone().mulS(seconds))
        }
        return !this.pickedUp
    }
}
