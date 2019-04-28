import {Player} from "../Player"
import {Monster} from "./Monster"
import {Level} from "../../Level"
import {angleToVector, clamp, vectorToAngle} from "../../Util"
import {Vector} from "vector2d"
import {ImageManager} from "../../ImageManager"

export class Ant extends Monster {

    private static readonly RADIUS = 15
    private static readonly MAX_SPEED = 120
    private static readonly ACCELERATION = 1000
    private static readonly PLAYER_ANGLE_WEIGHT = 60
    private static readonly HP = 3

    speed: Vector = new Vector(0, 0)

    constructor(player: Player, pos: Vector) {
        super(player, pos, Ant.RADIUS, Ant.HP)
    }

    aliveDraw(context: CanvasRenderingContext2D): void {
        context.fillStyle = "#525"
        context.beginPath()
        context.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        context.fill()

        const direction = (this.speed.clone()
            .add(angleToVector(this.angleToPlayer()).mulS(Ant.PLAYER_ANGLE_WEIGHT)))
        context.save()
        context.translate(this.pos.x, this.pos.y)
        context.rotate(vectorToAngle(direction) + Math.PI / 2)
        const img = ImageManager.get("ant")
        context.drawImage(img, 0, 0, img.width, img.height,
            - this.r, - this.r, this.r * 2, this.r * 2)

        context.restore()
    }

    aliveStep(seconds: number, level: Level) {
        let direction: Vector = this.player.pos.clone().subtract(this.pos) as Vector
        if (direction.length() !== 0) {
            direction.normalise().mulS(Ant.ACCELERATION * seconds)
        }
        this.speed.add(direction)
        const length2 = clamp(this.speed.magnitude(), 0, Ant.MAX_SPEED)

        if (this.speed.length() > 1e-6) {
            this.speed = this.speed.normalise().mulS(length2)
        } else {
            // Avoid division by zero
            this.speed.setAxes(0, 0)
        }

        this.pos.add(this.speed.clone().mulS(seconds))
        this.resolveLevelCollision(level, this.speed)
    }
}
