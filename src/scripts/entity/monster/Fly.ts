import {Player} from "../Player"
import {Monster} from "./Monster"
import {Level} from "../../Level"
import {Vector} from "vector2d"

export class Fly extends Monster {

    private static readonly RADIUS = 20
    private static readonly MAX_SPEED = 150
    private static readonly HP = 5
    private static readonly REORIENTATION_TIME = 1
    private static readonly ANGLE_SPEED_MAX = Math.PI
    private static readonly ANGLE_DELTA_MAX = Math.PI * 0.5
    private angle: number = 0
    private targetAngle: number = 0
    private timeSinceReorientation: number = Fly.REORIENTATION_TIME

    speed: Vector = new Vector(0, 0)

    constructor(player: Player, pos: Vector) {
        super(player, pos, Fly.RADIUS, Fly.HP)
    }

    aliveDraw(context: CanvasRenderingContext2D): void {
        context.fillStyle = "#228"
        context.beginPath()
        context.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        context.fill()
    }

    aliveStep(seconds: number, level: Level) {
        this.timeSinceReorientation += seconds
        if (this.timeSinceReorientation > Fly.REORIENTATION_TIME) {
            this.targetAngle = this.angleToPlayer() + (Math.random() - 0.5) * 2 * Fly.ANGLE_DELTA_MAX
            this.timeSinceReorientation = 0
        }

        this.angle = this.getCloserAngle(this.angle, this.targetAngle, Fly.ANGLE_SPEED_MAX * seconds)
        let speed = new Vector(Math.cos(this.angle), Math.sin(this.angle)).mulS(Fly.MAX_SPEED)
        this.pos.add(speed.clone().mulS(seconds))
    }
}
