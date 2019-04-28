import {Player} from "../Player"
import {Monster} from "./Monster"
import {Level} from "../../Level"
import {angleToVector, clamp, vectorToAngle} from "../../Util"
import {Vector} from "vector2d"
import {ImageManager} from "../../ImageManager"
import {Entity} from "../Entity"
import {Shot} from "../Shot"

export class Mosquito extends Monster {

    private static readonly RADIUS = 20
    private static readonly MAX_SPEED = 250
    private static readonly ACCELERATION = 750
    private static readonly HP = 3

    constructor(player: Player, pos: Vector) {
        super(player, pos, Mosquito.RADIUS, Mosquito.HP)
    }

    aliveDraw(context: CanvasRenderingContext2D): void {
        /*context.save()
        context.translate(this.pos.x, this.pos.y)
        context.rotate(this.imageAngle())
        const img = ImageManager.get("ant")
        context.drawImage(img, 0, 0, img.width, img.height,
            - this.r, - this.r, this.r * 2, this.r * 2)
        context.restore()*/
        this.drawDebugCircle(context, "#00f")
    }

    collideWith(entity: Entity): void {
        super.collideWith(entity)
        if (entity instanceof Shot) {
            this.speed = entity.speed.clone().normalise().mulS(Mosquito.MAX_SPEED) as Vector
        }
    }

    aliveStep(seconds: number, level: Level) {
        let direction: Vector = this.player.pos.clone().subtract(this.pos) as Vector
        if (direction.length() !== 0) {
            direction.normalise().mulS(Mosquito.ACCELERATION * seconds)
        }
        this.speed.add(direction)
        const length2 = clamp(this.speed.magnitude(), 0, Mosquito.MAX_SPEED)

        if (this.speed.length() > 1e-6) {
            this.speed = this.speed.normalise().mulS(length2)
        } else {
            // Avoid division by zero
            this.speed.setAxes(0, 0)
        }

        this.pos.add(this.speed.clone().mulS(seconds))
        // this.resolveLevelCollision(level, this.speed)
    }
}
