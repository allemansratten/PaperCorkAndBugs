import {Player} from "../Player"
import {Monster} from "./Monster"
import {Level} from "../../Level"
import {clamp} from "../../Util"
import {Vector} from "vector2d"

export class Ant extends Monster {

    private static readonly RADIUS = 15
    private static readonly MAX_SPEED = 120
    private static readonly ACCELERATION = 1000
    private static readonly HP = 3

    speed: Vector = new Vector(0, 0)

    constructor(player: Player, pos: Vector) {
        super(player, pos, Ant.RADIUS, Ant.HP)
    }

    draw(context: CanvasRenderingContext2D): void {
        context.globalAlpha = this.getAlpha()
        context.fillStyle = "#525"
        context.beginPath()
        context.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        context.fill()
        context.globalAlpha = 1
    }

    step(seconds: number, level: Level): boolean {
        if (!super.step(seconds, level)) {
            return false
        }
        if (!this.alive()) {
            return true
        }
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

        return true
    }
}
