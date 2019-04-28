import {Entity} from "./Entity"
import {DirectionKeyState} from "../DirectionKeyState"
import {Vector} from "vector2d"
import {Level} from "../Level"
import {CircleHitbox} from "./CircleHitbox"
import {Eye} from "./Eye"
import {Shot} from "./Shot"
import {clamp, Smoother} from "../Util"
import {Arm} from "./Arm"
import {Leg} from "./Leg"
import {Monster} from "./monster/Monster"
import {Projectile} from "./Projectile"
import {BodyPart} from "./BodyPart"

export class Player extends Entity {

    private static readonly RADIUS = 32
    static readonly MAX_SPEED = 240 // px / s
    static readonly ZERO_LEGS_MAX_SPEED = 20 // px / s
    private static readonly ACCELERATION = 2000 // px / s^2
    private static readonly DECELERATION = 800
    private static readonly SHOOTING_SPEED = 5
    private static readonly INVINCIBLE_AFTER_HIT_TIME = 1
    private static readonly ALIVE_COLOR = "#9e502c"
    private static readonly INVINCIBLE_COLOR = "#ff502c"
    private static readonly DEAD_COLOR = "#91a05b"
    private static readonly MOUTH_COLOR = "#512815"
    private static readonly MOUTH_RANGE = 0.8
    private static readonly ZOOM_0_EYES = 5
    private static readonly ZOOM_1_EYE = 2
    private static readonly ZOOM_MAX_EYES = 0.5
    private static readonly HIT_THICC_MULTIPLIER = 6

    speed: Vector = new Vector(0, 0)

    movementKeyState: DirectionKeyState = new DirectionKeyState(
        ["w", "d", "s", "a"]
    )
    shootingKeyState: DirectionKeyState = new DirectionKeyState(
        ["arrowup", "arrowright", "arrowdown", "arrowleft"]
    )

    readonly friendly: boolean = true
    alive: boolean = true
    private shotCooldown: number = 0 // Time until next shot
    private invincibleTime: number = 0
    zoomSmoother: Smoother

    // hit animations
    private hitAnimStatus: number = -1
    private hitStartTime: number
    private hitSinePrev: number

    private eyes: Eye[] = []
    private arms: Arm[] = []
    private legs: Leg[] = []
    private activeArmIndex: number = 0

    childEyes = 0
    childLegs = 0
    childArms = 0

    constructor(pos: Vector) {
        super(pos, Player.RADIUS, new CircleHitbox((Player.RADIUS)))
        for (let i = 0; i < 6; i++) {
            this.eyes.push(new Eye(pos, Eye.randomEyeSize()))
        }
        for (let i = 0, dir = 0; i < 6; i++, dir++) {
            if (dir == 0 || dir == 4) dir++
            this.arms.push(new Arm(pos, dir))
        }
        for (let i = 0; i < 6; i++) {
            this.legs.push(new Leg(pos))
        }
        this.zoomSmoother = new Smoother(this.getTargetZoom(), 1)
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
        context.fillStyle = this.invincibleTime > 0 ? Player.INVINCIBLE_COLOR : Player.ALIVE_COLOR
        context.beginPath()
        if (this.hitAnimStatus == -1)
            context.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        else {
            let hitSine = Math.sin((this.hitStartTime - time) / 100)
            context.arc(this.pos.x, this.pos.y, this.r - hitSine * Player.HIT_THICC_MULTIPLIER, 0, 2 * Math.PI)
            if (this.hitAnimStatus == 0 && hitSine >= 0.9) {
                this.hitAnimStatus = 1
            }
            if (this.hitAnimStatus == 1 && hitSine <= 0.1) {
                this.hitAnimStatus = -1
            }
            this.hitSinePrev = hitSine
        }
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
        if (this.invincibleTime <= 0) {
            context.arc(this.pos.x, this.pos.y,
                this.r / 2, Math.PI * (1 - Player.MOUTH_RANGE) + mouth_range_sine,
                Math.PI * Player.MOUTH_RANGE - mouth_range_sine
            )
        } else {
            context.arc(this.pos.x, this.pos.y + this.r / 1.5, this.r / 2,
                Math.PI + Math.PI * (1 - Player.MOUTH_RANGE),
                Math.PI + Math.PI * Player.MOUTH_RANGE
            )
        }

        context.stroke()

        // draw arms
        this.arms.forEach((arm, index) => {
            arm.pos = new Vector(this.pos.x - 40, this.pos.y + 5 * index)

            if (index <= 2) {
                arm.pos = new Vector(this.pos.x + this.r * 1.3, this.pos.y + index / 6 * 80 - 20)
            } else {
                arm.pos = new Vector(this.pos.x - this.r * 1.3, this.pos.y - index / 6 * 80 + 50)
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
        const maxSpeed = this.getMaxMovementSpeed()
        const length2 = clamp(this.speed.magnitude() - Player.DECELERATION * seconds, 0, maxSpeed)

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

            spawnPos.add(this.pos.clone().mulS(3))
            spawnPos.mulS(1 / 4)
            this.arms[this.activeArmIndex].doRecoil()
            this.droppedEntities.push(new Shot(this, spawnPos, direction))
            const shootingSpeed = this.getShootingSpeed()
            this.shotCooldown = 1 / shootingSpeed
        }
    }

    step(seconds: number, level: Level): boolean {
        this.invincibleTime = Math.max(0, this.invincibleTime - seconds)
        this.stepMovement(seconds, level)
        this.stepShooting(seconds)
        this.zoomSmoother.setTarget(this.getTargetZoom())
        this.zoomSmoother.step(seconds)
        return true
    }

    collideWith(entity: Entity): void {
        if (this.invincibleTime <= 0 && (entity instanceof Monster || entity instanceof Projectile)) {
            this.hitAnim()
            const partIndex = Math.floor(Math.random() * (this.eyes.length + this.arms.length + this.legs.length))
            if (partIndex < this.eyes.length) {
                this.eyes.pop()
            } else if (partIndex - this.eyes.length < this.arms.length) {
                this.arms.pop()
            } else {
                this.legs.pop()
            }
            this.invincibleTime = Player.INVINCIBLE_AFTER_HIT_TIME
        } else if (entity instanceof BodyPart) {
            if (entity instanceof Arm) {
                this.childArms++
            } else if (entity instanceof Leg) {
                this.childLegs++
            } else {
                this.childEyes++
            }
        }
        if (this.legs.length == 0 && this.arms.length == 0 && this.eyes.length == 0) this.alive = false
    }

    hitAnim(): void {
        this.hitStartTime = Date.now()
        this.hitAnimStatus = 0
        this.hitSinePrev = 0
    }

    private getTargetZoom(): number {
        if (this.eyes.length === 0) {
            return Player.ZOOM_0_EYES
        }
        const goodness = (this.eyes.length - 1) / 9
        return Math.exp(Math.log(Player.ZOOM_MAX_EYES) * goodness + Math.log(Player.ZOOM_1_EYE) * (1 - goodness))
        // return 1 / (1 + 0.05 * this.eyes.length)
    }

    public getZoom(): number {
        return this.zoomSmoother.get()
    }

    getMaxMovementSpeed(): number {
        if (this.legs.length == 0) {
            return Player.ZERO_LEGS_MAX_SPEED
        } else {
            return Player.MAX_SPEED * 0.5 + this.legs.length * 0.1 * Player.MAX_SPEED
        }
    }

    getShootingSpeed(): number {
        return Player.SHOOTING_SPEED * 0.1 + this.arms.length * Player.SHOOTING_SPEED * 0.1
    }
}
