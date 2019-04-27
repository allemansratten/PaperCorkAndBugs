import {Entity} from "./Entity"
import {DirectionKeyState} from "../DirectionKeyState"
import {Vector} from "vector2d"
import {Level} from "../Level"
import {CircleHitbox} from "./CircleHitbox"
import {Eye} from "./Eye"
import {Shot} from "./Shot"
import {clamp} from "../Util"
import {Arm} from "./Arm"
import {Leg} from "./Leg"
import {Monster} from "./monster/Monster"
import {Projectile} from "./Projectile"

export class Player extends Entity {

    private static readonly RADIUS = 32
    static readonly MAX_SPEED = 240 // px / s
    static readonly ZERO_LEGS_MAX_SPEED = 20 // px / s
    private static readonly ACCELERATION = 2000 // px / s^2
    private static readonly DEACCELERATION = 800
    private static readonly SHOOTING_SPEED = 5
    private static readonly INVINCIBLE_AFTER_HIT_TIME = 1

    speed: Vector = new Vector(0, 0)

    movementKeyState: DirectionKeyState = new DirectionKeyState(
        ["w", "d", "s", "a"]
    )
    shootingKeyState: DirectionKeyState = new DirectionKeyState(
        ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"]
    )

    private static readonly ALIVE_COLOR = "#9e502c"
    private static readonly INVINCIBLE_COLOR = "#ff502c"
    private static readonly DEAD_COLOR = "#91a05b"
    private static readonly MOUTH_COLOR = "#512815"
    private static readonly MOUTH_RANGE = 0.8

    readonly friendly: boolean = true
    private alive: boolean = true
    entitiesToAdd: Entity[] = [] // For entities produced by the player
    private shotCooldown: number = 0 // Time until next shot
    private inivincibleTime: number = 0

    private eyes: Eye[] = []
    private arms: Arm[] = []
    private legs: Leg[] = []
    private activeArmIndex: number = 0

    constructor(pos: Vector) {
        super(pos, Player.RADIUS, new CircleHitbox((Player.RADIUS)))
        for (let i = 0; i < 6; i++) {
            this.eyes.push(new Eye(pos, 5 + (Math.random() - 0.5) * 2.5))
        }
        for (let i = 0, dir = 0; i < 6; i++, dir++) {
            if (dir == 0 || dir == 4) dir++
            this.arms.push(new Arm(pos, dir))
        }
        for (let i = 0; i < 6; i++) {
            this.legs.push(new Leg(pos))
        }
    }

    draw(context: CanvasRenderingContext2D): void {
        super.draw(context)
        let time = Date.now()

        // draw legs
        this.legs.forEach((leg, index) => {
            leg.speed = this.speed.length()
            if (index % 2 == 0) {
                leg.pos = new Vector(this.pos.x + this.r * Math.sin(index / this.legs.length) + 2, this.pos.y + this.r * Math.cos(index / this.legs.length))
                leg.rot = -index / this.legs.length * Math.PI / 2
            } else {
                leg.pos = new Vector(this.pos.x - this.r * Math.sin(index / this.legs.length) - 1, this.pos.y + this.r * Math.cos(index / this.legs.length))
                leg.rot = index / this.legs.length * Math.PI / 3
            }

            leg.draw(context)
        })

        // draw body
        context.fillStyle = this.inivincibleTime > 0 ? Player.INVINCIBLE_COLOR : this.alive ? Player.ALIVE_COLOR : Player.DEAD_COLOR
        context.beginPath()
        context.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        context.fill()

        // draw eyes
        this.eyes.forEach((eye, index) => {
            if (this.eyes.length == 1) {
                eye.pos = new Vector(this.pos.x, this.pos.y - this.r)
            } else {
                if (index >= 8 && index <= 9)
                    eye.pos = new Vector(this.pos.x + (8.5 - index) * this.r * 0.9, this.pos.y - this.r / 5.6)
                if (index >= 6 && index <= 7)
                    eye.pos = new Vector(this.pos.x + (6.5 - index) * this.r * 1.4, this.pos.y - this.r / 1.6)
                else if (index >= 4 && index <= 5)
                    eye.pos = new Vector(this.pos.x + (4.5 - index) * this.r * 1.6, this.pos.y - this.r / 3.5)
                else if (index >= 2 && index <= 3)
                    eye.pos = new Vector(this.pos.x, this.pos.y - this.r / 3 + (2 - index) * 13)
                else if (index >= 0 && index <= 1)
                    eye.pos = new Vector(this.pos.x + (-0.5 + index) * this.r * 0.7, this.pos.y - this.r / 2)
            }
            eye.draw(context)
        })

        // draw mouth
        context.fillStyle = Player.MOUTH_COLOR
        context.beginPath()
        let mouth_range_sine = Math.sin(time / 300) / 4
        this.alive ?
            context.arc(this.pos.x, this.pos.y, this.r / 2, Math.PI * (1 - Player.MOUTH_RANGE) + mouth_range_sine, Math.PI * Player.MOUTH_RANGE - mouth_range_sine) :
            context.arc(this.pos.x, this.pos.y + this.r / 1.5, this.r / 2, Math.PI + Math.PI * (1 - Player.MOUTH_RANGE), Math.PI + Math.PI * Player.MOUTH_RANGE)
        context.stroke()

        // draw arms
        this.arms.forEach((arm, index) => {
            arm.pos = new Vector(this.pos.x - 40, this.pos.y + 5 * index)

            if (index <= 2) {
                arm.pos = new Vector(this.pos.x + this.r * 1.2, this.pos.y + index / 6 * 80 - 20)
            } else {
                arm.pos = new Vector(this.pos.x - this.r * 1.2, this.pos.y - index / 6 * 80 + 50)
            }

            arm.draw(context)
        })

    }

    private stepMovement(seconds: number, level: Level) {
        // Acceleration
        let direction: Vector = this.movementKeyState.getDirection()
        const accel = Player.ACCELERATION * 0.5 + this.legs.length * 0.1 * Player.ACCELERATION
        if (direction.length() !== 0) {
            direction.normalise().mulS(accel * seconds)
        }

        this.speed.add(direction)
        // Deacceleration
        const maxSpeed = this.legs.length == 0 ? Player.ZERO_LEGS_MAX_SPEED : Player.MAX_SPEED * 0.5 + this.legs.length * 0.1 * Player.MAX_SPEED
        const length2 = clamp(this.speed.magnitude() - Player.DEACCELERATION * seconds, 0, maxSpeed)

        if (this.speed.length() > 1e-6) {
            this.speed = this.speed.normalise().mulS(length2)
        } else {
            // Avoid division by zero
            this.speed.setAxes(0, 0)
        }

        this.pos.add(this.speed.clone().mulS(seconds))
        this.resolveLevelCollision(level, this.speed)
    }

    private stepShooting(seconds: number) {
        let direction: Vector = this.shootingKeyState.getDirection()
        this.shotCooldown = Math.max(0, this.shotCooldown - seconds)
        if (this.shotCooldown === 0 && direction.length() !== 0 && this.arms.length > 0) {
            this.activeArmIndex = (this.activeArmIndex + 1) % this.arms.length
            let spawnPos = this.arms[this.activeArmIndex].getSpawnPoint()
            this.entitiesToAdd.push(new Shot(this, this.pos.clone() as Vector, direction))
            const shootingSpeed = Player.SHOOTING_SPEED * 0.1 + this.arms.length * Player.SHOOTING_SPEED * 0.1
            this.shotCooldown = 1 / shootingSpeed
        }
    }

    step(seconds: number, level: Level): boolean {
        this.inivincibleTime = Math.max(0, this.inivincibleTime - seconds)
        this.stepMovement(seconds, level)
        this.stepShooting(seconds)

        return true
    }

    collideWith(entity: Entity): void {
        if (this.inivincibleTime <= 0 && (entity instanceof Monster || entity instanceof Projectile)) {
            const partIndex = Math.floor(Math.random() * (this.eyes.length + this.arms.length + this.legs.length))
            if (partIndex < this.eyes.length) {
                this.eyes.pop()
            } else if (partIndex - this.eyes.length < this.arms.length) {
                this.arms.pop()
            } else {
                this.legs.pop()
                this.alive = false
            }
            this.inivincibleTime = Player.INVINCIBLE_AFTER_HIT_TIME
        }
    }
}
