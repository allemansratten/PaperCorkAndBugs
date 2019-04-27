import {Player} from "./Player"
import {Monster} from "./Monster"
import {Level} from "../Level"
import {angleDistance, hypot} from "../Util"
import {Entity} from "./Entity"
import {Vector} from "vector2d"

export class FollowMonster extends Monster {

    private static readonly RADIUS = 20
    private static readonly ANGLE_SPEED_MAX = Math.PI / 2
    private static readonly SPEED = 100
    private static readonly HP = 100
    private angle: number = 0

    constructor(player: Player, pos : Vector) {
        super(player, pos, FollowMonster.RADIUS, FollowMonster.HP)
        this.angle = this.angleToPlayer()
    }


    private angleToPlayer(): number {
        const delta = this.player.pos.clone().subtract(this.pos)
        return Math.atan2(delta.y, delta.x)
    }


    draw(context: CanvasRenderingContext2D): void {
        context.fillStyle = "#2fa"
        context.beginPath()
        context.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        context.fill()
    }


    step(seconds: number, level: Level): boolean {
        if (!this.alive) return true // leave a corpse
        const newAngle = this.angleToPlayer()
        const angleDif = Math.min(angleDistance(newAngle, this.angle), FollowMonster.ANGLE_SPEED_MAX * seconds)
        const a1 = this.angle + angleDif
        const a2 = this.angle - angleDif
        if (angleDistance(a1, newAngle) < angleDistance(a2, newAngle)) {
            this.angle = a1
        } else {
            this.angle = a2
        }
        this.pos.x += FollowMonster.SPEED * seconds * Math.cos(this.angle)
        this.pos.y += FollowMonster.SPEED * seconds * Math.sin(this.angle)
        return this.alive
    }

    collidesWith(entity: Entity): boolean {
        // return hypot(entity.x - this.x, entity.y - this.y) < this.r + entity.r
        return false
    }
}
