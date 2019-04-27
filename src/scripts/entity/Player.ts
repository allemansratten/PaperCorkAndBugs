import {Entity} from "./Entity"
import {DirectionKeyState} from "../DirectionKeyState"
import {Vector} from "vector2d"
import {Level} from "../Level"

export class Player extends Entity {

    private static readonly RADIUS = 23
    private static readonly MAX_SPEED = 240 // px / s
    private static readonly ACCELERATION = 2000 // px / s^2
    private static readonly DEACCELERATION = 800

    speed : Vector = new Vector(0,0)

    movementKeyState : DirectionKeyState = new DirectionKeyState(
        ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"]
    );

    private static readonly ALIVE_COLOR = "#d22"
    private static readonly DEAD_COLOR = "#900"

    readonly friendly: boolean = true

    constructor(x: number, y: number) {
        super(x, y, Player.RADIUS)
    }

    draw(context: CanvasRenderingContext2D): void {
        super.draw(context)
        context.fillStyle = Player.ALIVE_COLOR
        context.beginPath()
        context.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
        context.fill()
    }

    step(seconds: number, level:Level): boolean {
        // Acceleration
        let direction: Vector = this.movementKeyState.getDirection()
        if (direction.length() !== 0) {
            direction.normalise().mulS(Player.ACCELERATION * seconds)
        }
        this.speed.add(direction)

        // Deacceleration
        const length2 = clamp(this.speed.magnitude() - Player.DEACCELERATION * seconds, 0, Player.MAX_SPEED)

        if (this.speed.magnitude() > 1e-6) {
            this.speed = this.speed.normalise().mulS(length2)
        } else {
            this.speed.setAxes(0, 0)
        }

        this.x += this.speed.x * seconds
        this.y += this.speed.y * seconds
        return true
    }

    collidesWith(entity: Entity): boolean {
        return false
    }

    die(): void {

    }

}

function clamp(a: number, mn: number, mx: number): number {
    return Math.min(mx, Math.max(mn, a))

}
