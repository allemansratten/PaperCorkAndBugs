import {Monster} from "./Monster"
import {Player} from "../Player"
import {Level} from "../../Level"
import {Vector} from "vector2d"
import {Entity} from "../Entity"
import {Shot} from "../Shot"

export class Worm extends Monster {

    private static readonly RADIUS = 20
    private static readonly COLOR = "#faa"
    private static readonly HP = 5
    private static readonly SHOOTING_FREQ = 1
    private static readonly SHOT_SPEED = 300
    private timeSinceLastShot : number = 1 / Worm.SHOOTING_FREQ

    constructor(player: Player, pos: Vector) {
        super(player, pos, Worm.RADIUS, Worm.HP)
    }

    draw(context: CanvasRenderingContext2D): void {
        context.globalAlpha = this.getAlpha()
        context.fillStyle = Worm.COLOR
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
        this.timeSinceLastShot += seconds
        if (this.timeSinceLastShot > 1 / Worm.SHOOTING_FREQ) {
            this.createdEntities.push(
                new Shot(
                    this.player,
                    this.pos,
                    this.player.pos.clone().subtract(this.pos) as Vector,
                    false,
                    Worm.SHOT_SPEED
                )
            )
            this.timeSinceLastShot = 0
        }

        return true
    }
}
