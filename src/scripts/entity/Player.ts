import {Entity} from "./Entity"
import {DirectionKeyState} from "../DirectionKeyState"
import {Vector} from "vector2d"
import {Level} from "../Level"
import {CircleHitbox} from "./CircleHitbox"
import {FollowMonster} from "./FollowMonster"
import {StationaryMonster} from "./StationaryMonster"
import {Eye} from "./Eye"
import {Shot} from "./Shot"
import {clamp} from "../Util"
import {Arm} from "./Arm"
import {Leg} from "./Leg"

export class Player extends Entity {

    private static readonly RADIUS = 32
    private static readonly MAX_SPEED = 240 // px / s
    private static readonly ACCELERATION = 2000 // px / s^2
    private static readonly DEACCELERATION = 800
    private static readonly SHOOTING_SPEED = 5

    speed: Vector = new Vector(0, 0)

    movementKeyState: DirectionKeyState = new DirectionKeyState(
        ["w", "d", "s", "a"]
    )
    shootingKeyState: DirectionKeyState = new DirectionKeyState(
        ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"]
    )

    private static readonly ALIVE_COLOR = "#9e502c"
    private static readonly DEAD_COLOR = "#91a05b   "
    private static readonly MOUTH_COLOR = "#512815"
    private static readonly MOUTH_RANGE = 0.8

    readonly friendly: boolean = true
    private alive: boolean = true
    entitiesToAdd: Entity[] = [] // For projectiles produced by the player
    private shotCooldown: number = 0 // Time until next shot

    private eyes: Eye[] = []
    private arms: Arm[] = []
    private legs: Leg[] = []

    constructor(pos: Vector) {
        super(pos, Player.RADIUS, new CircleHitbox((Player.RADIUS)))
        for (let i = 0; i < 6; i++) {
            this.eyes.push(new Eye(pos, 5 + (Math.random() - 0.5) * 2.5))
        }
        for (let i = 0; i < 6; i++) {
            this.arms.push(new Arm(pos))
        }
        for (let i = 0; i < 6; i++) {
            this.legs.push(new Leg(pos))
        }
    }

    draw(context: CanvasRenderingContext2D): void {
        super.draw(context)
        let time = Date.now()

        // draw body
        context.fillStyle = this.alive ? Player.ALIVE_COLOR : Player.DEAD_COLOR
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
            arm.draw(context)
        })

        // draw legs
        this.legs.forEach((leg, index) => {
            leg.pos = new Vector(this.pos.x - 8 + 5 * index, this.pos.y + 30)
            leg.draw(context)
        })
    }

    private stepMovement(seconds: number, level: Level) {
        // Acceleration
        let direction: Vector = this.movementKeyState.getDirection()
        if (direction.length() !== 0) {
            direction.normalise().mulS(Player.ACCELERATION * seconds)
        }
        this.speed.add(direction)

        // Deacceleration
        const length2 = clamp(this.speed.magnitude() - Player.DEACCELERATION * seconds, 0, Player.MAX_SPEED)

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
        if (this.shotCooldown === 0 && direction.length() !== 0) {
            this.entitiesToAdd.push(new Shot(this, this.pos.clone() as Vector, direction))
            this.shotCooldown = 1 / Player.SHOOTING_SPEED
        }
    }

    step(seconds: number, level: Level): boolean {
        this.stepMovement(seconds, level)
        this.stepShooting(seconds)

        return true
    }

    collideWith(entity: Entity): void {
        if (entity instanceof FollowMonster || entity instanceof StationaryMonster) {
            this.alive = false
        }
    }
}
