import {Player} from "../Player"
import {Monster} from "./Monster"
import {Level} from "../../Level"
import {clamp, interpolateLinear} from "../../Util"
import {Vector} from "vector2d"

export class Wasp extends Monster {

    private static readonly RADIUS = 20
    private static readonly MAX_SPEED_NORMAL = 120
    private static readonly MAX_SPEED_CHARGING = 500
    private static readonly CHARGE_ACCELERATION = 250
    private static readonly ACCELERATION = 1000
    private static readonly DEACCELERATION = 500
    private static readonly HP = 4
    private static readonly CHARGE_PREP_TIME = 1
    private static readonly CHARGE_DISTANCE = 200
    private static readonly CHARGE_COOLDOWN = 5
    private static readonly CHARGE_DURATION = 1
    private static readonly COLOR_DEFAULT = [200, 200, 0]
    private static readonly COLOR_ANGRY = [200, 50, 50]

    chargePrepProgress: number = 0 // How long has the wasp been waiting to charge?
    timeSinceLastCharge: number = Wasp.CHARGE_COOLDOWN
    speed: Vector = new Vector(0, 0)

    constructor(player: Player, pos: Vector) {
        super(player, pos, Wasp.RADIUS, Wasp.HP)
    }

    aliveDraw(context: CanvasRenderingContext2D): void {
        context.globalAlpha = this.getAlpha()
        context.fillStyle = this.getColor() //"#cc0"
        context.strokeStyle = "#000"
        context.lineWidth = 3
        context.beginPath()
        context.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        context.fill()
        context.stroke()
    }

    aliveStep(seconds: number, level: Level) {
        this.r = interpolateLinear(20, 30, this.getAngriness())

        this.timeSinceLastCharge += seconds
        let chargeDone = false
        let direction: Vector
        if (this.chargePrepProgress > 0) {
            direction = new Vector(0, 0)
            this.chargePrepProgress += seconds
            if (this.chargePrepProgress >= Wasp.CHARGE_PREP_TIME) {
                chargeDone = true
                this.chargePrepProgress = 0
            }
            direction = new Vector(0, 0)
        } else {
            direction = this.player.pos.clone().subtract(this.pos) as Vector
        }

        if (direction.length() !== 0) {
            const accel = this.timeSinceLastCharge > Wasp.CHARGE_DURATION
                ? Wasp.ACCELERATION : Wasp.CHARGE_ACCELERATION
            direction.normalise().mulS(accel * seconds)
        }
        this.speed.add(direction)

        const maxSpeed = this.timeSinceLastCharge < Wasp.CHARGE_DURATION ? Wasp.MAX_SPEED_CHARGING : Wasp.MAX_SPEED_NORMAL
        const length2 = clamp(this.speed.magnitude() - Wasp.DEACCELERATION * seconds, 0, maxSpeed)

        if (this.speed.length() > 1e-6) {
            this.speed = this.speed.normalise().mulS(length2)
        } else {
            // Avoid division by zero
            this.speed.setAxes(0, 0)
        }

        if (chargeDone) {
            this.timeSinceLastCharge = 0
            direction = this.player.pos.clone().subtract(this.pos) as Vector
            this.speed = direction.normalise().mulS(Wasp.MAX_SPEED_CHARGING)
        }

        this.pos.add(this.speed.clone().mulS(seconds))

        if (this.chargePrepProgress === 0 &&
            this.timeSinceLastCharge > Wasp.CHARGE_COOLDOWN &&
            this.player.pos.distance(this.pos) < Wasp.CHARGE_DISTANCE) {
            this.chargePrepProgress += seconds
        }
    }

    getAngriness(): number {
        return Math.max(
            0,
            this.chargePrepProgress / Wasp.CHARGE_PREP_TIME,
            1 - this.timeSinceLastCharge / Wasp.CHARGE_DURATION
        )
    }

    getColor(): string {
        let rgb = [0, 0, 0]
        for (let i = 0; i < 3; i++) {
            rgb[i] = Math.floor(interpolateLinear(Wasp.COLOR_DEFAULT[i], Wasp.COLOR_ANGRY[i], this.getAngriness()))
        }
        return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`
    }
}
