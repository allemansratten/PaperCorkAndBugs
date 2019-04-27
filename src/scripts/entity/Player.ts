import {Entity} from "./Entity"
import {DirectionKeyState} from "../DirectionKeyState"
import {Vector} from "vector2d"
import {Level} from "../Level"
import {CircleHitbox} from "./CircleHitbox"
import {FollowMonster} from "./FollowMonster"
import {StationaryMonster} from "./StationaryMonster"
import {Shot} from "./Shot"

export class Player extends Entity {

    private static readonly RADIUS = 23
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

    private static readonly ALIVE_COLOR = "#d22"
    private static readonly DEAD_COLOR = "#900"

    readonly friendly: boolean = true
    private alive: boolean = true
    entitiesToAdd : Entity[] = [] // For projectiles produced by the player
    private shotCooldown: number = 0 // Time until next shot

    constructor(pos: Vector) {
        super(pos, Player.RADIUS, new CircleHitbox((Player.RADIUS)))
    }

    draw(context: CanvasRenderingContext2D): void {
        super.draw(context)
        context.fillStyle = this.alive ? Player.ALIVE_COLOR : Player.DEAD_COLOR
        context.beginPath()
        context.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        context.fill()
    }

    private stepMovement(seconds: number) {
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
        this.stepMovement(seconds)
        this.stepShooting(seconds)

        return true
    }

    collideWith(entity: Entity): void {
        if (entity instanceof FollowMonster || entity instanceof StationaryMonster) {
            this.alive = false
        }
    }
}

function clamp(a: number, mn: number, mx: number): number {
    return Math.min(mx, Math.max(mn, a))

}
