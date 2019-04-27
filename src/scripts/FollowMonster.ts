import {Player} from "./Player"
import {Monster} from "./Monster"

export class FollowMonster extends Monster {

    private static readonly RADIUS = 20
    private static readonly ANGLE_SPEED_MAX = Math.PI / 2
    private static readonly SPEED = 100
    private angle: number = 0

    constructor(player: Player, x: number, y: number) {
        super(player, x, y, FollowMonster.RADIUS)
        this.angle = this.angleToPlayer()
    }

    private static angleDistance(a1: number, a2: number): number {
        const dif1 = Math.abs(a1 - a2)
        const dif2 = Math.abs(a1 - a2 - Math.PI * 2)
        const dif3 = Math.abs(a1 - a2 + Math.PI * 2)
        return Math.min(dif1, dif2, dif3)
    }

    private angleToPlayer(): number {
        return Math.atan2(this.player.y - this.y, this.player.x - this.x)
    }

    step(seconds: number): void {
        /*  const newAngle = this.angleToPlayer()
          const angleDif = Math.min(FollowMonster.angleDistance(newAngle, this.angle), FollowMonster.ANGLE_SPEED_MAX * seconds)
          const a1 = this.angle + angleDif
          const a2 = this.angle - angleDif
          if (FollowMonster.angleDistance(a1, newAngle) < FollowMonster.angleDistance(a2, newAngle)) {
              this.angle = a1
          } else {
              this.angle = a2
          }
          this.x += FollowMonster.SPEED * seconds * Math.cos(this.angle)
          this.y += FollowMonster.SPEED * seconds * Math.sin(this.angle)*/
    }

    draw(context: CanvasRenderingContext2D): void {
        context.fillStyle = "#2fa"
        context.beginPath()
        context.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
        context.fill()
    }
}