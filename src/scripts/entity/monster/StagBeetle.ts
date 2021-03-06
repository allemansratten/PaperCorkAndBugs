import {Player} from "../Player"
import {Monster} from "./Monster"
import {Level} from "../../Level"
import {angleDistance} from "../../Util"
import {Vector} from "vector2d"
import {ImageManager} from "../../ImageManager"

export class StagBeetle extends Monster {

    private static readonly RADIUS = 30
    private static readonly ANGLE_SPEED_MAX = Math.PI / 2
    private static readonly ANGRY_ANGLE = Math.PI / 6
    private static readonly SPEED = 70
    private static readonly ANGRY_SPEED = 180
    private static readonly ANGRY_COOLDOWN = 0.5
    private static readonly HP = 8
    private angle: number = 0
    private angry: boolean = false
    private angryCooldown: number = 0
    protected timeSinceDeath: number = 0

    constructor(player: Player, pos: Vector) {
        super(player, pos, StagBeetle.RADIUS, StagBeetle.HP)
        this.angle = this.angleToPlayer()
    }

    aliveDraw(context: CanvasRenderingContext2D): void {
        /*     context.fillStyle = "#2fa"
             if (this.angry) {
                 context.fillStyle = "#d33"
             }
             context.beginPath()
             context.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
             context.fill()

     */
        context.save()
        context.translate(this.pos.x, this.pos.y)
        context.rotate(this.imageAngle())
        const img = this.angry ? ImageManager.get("stagBeetleAngry") : ImageManager.get("stagBeetle")
        context.drawImage(img, 0, 0, img.width, img.height,
            -this.r, -this.r, this.r * 2, this.r * 2)
        context.restore()
    }

    aliveStep(seconds: number, level: Level) {
        this.angryCooldown = Math.max(0, this.angryCooldown - seconds)
        this.angle = Monster.getCloserAngle(this.angle, this.angleToPlayer(), StagBeetle.ANGLE_SPEED_MAX * seconds)
        this.angry = (this.angryCooldown === 0) && angleDistance(this.angle, this.angleToPlayer()) < StagBeetle.ANGRY_ANGLE
        const speedMagnitude = this.angry ? StagBeetle.ANGRY_SPEED : StagBeetle.SPEED
        this.speed = new Vector(Math.cos(this.angle), Math.sin(this.angle)).mulS(speedMagnitude)
        this.pos.add(this.speed.clone().mulS(seconds))

        const didCollide = this.resolveLevelCollision(level, this.speed)
        if (didCollide) {
            this.angryCooldown = StagBeetle.ANGRY_COOLDOWN
        }
    }
}
