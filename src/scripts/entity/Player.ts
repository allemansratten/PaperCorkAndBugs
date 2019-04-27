import {Entity} from "./Entity"
import {Level} from "../Level"

export class Player extends Entity {

    private static readonly RADIUS = 23
    private static readonly SWORD_LENGTH = 100
    private static readonly SPEED = 160

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

    step(seconds: number, level: Level): boolean {
        return true
    }

    collidesWith(entity: Entity): boolean {
        return false
    }

    die(): void {

    }
}