import {Monster} from "./Monster"
import {Player} from "../Player"
import {Level} from "../../Level"
import {Vector} from "vector2d"
import {Shot} from "../Shot"
import {Entity} from "../Entity"
import {CircleHitbox} from "../CircleHitbox"

export class Worm extends Monster {

    private static readonly RADIUS = 20
    private static readonly COLOR = "#faa"
    private static readonly HP = 4
    private static readonly SHOOTING_FREQ = 1
    private static readonly SHOT_SPEED = 300
    private static readonly TELEPORT_FREQ = 0.1
    private static readonly TELEPORT_MAX_DISTANCE = 400
    public static readonly TELEPORT_TIME = 2
    private targetPos: Vector = null
    private timeSinceLastShot: number = 1 / Worm.SHOOTING_FREQ
    private timeSinceLastTeleport: number
    private timeSinceTeleportStart: number


    constructor(player: Player, pos: Vector) {
        super(player, pos, Worm.RADIUS, Worm.HP)
        this.timeSinceLastTeleport = Math.random() * (1 / Worm.TELEPORT_FREQ)
    }

    aliveDraw(context: CanvasRenderingContext2D): void {
        context.fillStyle = Worm.COLOR
        context.beginPath()
        context.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        context.fill()
    }

    aliveStep(seconds: number, level: Level) {
        this.timeSinceLastShot += seconds
        this.timeSinceLastTeleport += seconds
        if (this.timeSinceTeleportStart > 0) {
            this.timeSinceTeleportStart += seconds
            if (this.timeSinceTeleportStart > Worm.TELEPORT_TIME) {
                this.pos = this.targetPos
                this.targetPos = null
                this.timeSinceTeleportStart = 0
                this.timeSinceLastShot = (1 / Worm.SHOOTING_FREQ) / 2 // Prevent from shooting immediately after teleport
            }
        } else {
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
            if (this.timeSinceLastTeleport > 1 / Worm.TELEPORT_FREQ) {
                this.timeSinceLastTeleport = 0
                this.targetPos = level.generateValidPosCloseTo(this.r, this.player.pos, Worm.TELEPORT_MAX_DISTANCE)
                this.createdEntities.push(new WormShadow(this.targetPos))
                this.timeSinceTeleportStart = seconds
            }
        }
    }
}

export class WormShadow extends Entity {
    private static readonly DURATION = Worm.TELEPORT_TIME
    private static readonly RADIUS = 30
    friendly: boolean = false
    private timeSinceCreation = 0

    constructor(public pos: Vector) {
        super(pos.clone() as Vector, WormShadow.RADIUS, new CircleHitbox(WormShadow.RADIUS))
    }

    collideWith(entity: Entity): void {
    }

    step(seconds: number, level: Level): boolean {
        this.timeSinceCreation += seconds
        return this.timeSinceCreation < WormShadow.DURATION
    }

    draw(context: CanvasRenderingContext2D) {
        context.globalAlpha = this.timeSinceCreation / WormShadow.DURATION / 2
        context.fillStyle = "#444"
        context.beginPath()
        context.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        context.fill()
        context.globalAlpha = 1
    }
}
