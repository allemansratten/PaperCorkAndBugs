import {Entity} from "./Entity"

export class Player extends Entity {

    private static readonly RADIUS = 23
    private static readonly SWORD_LENGTH = 100
    private static readonly SPEED = 160

    constructor(x: number, y: number) {
        super(x, y, Player.RADIUS)
    }

    draw(context: CanvasRenderingContext2D): void {
        super.draw(context)
        
        context.fillStyle = "#d22"
        context.beginPath()
        context.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
        context.fill()
    }

    step(seconds: number): void {

    }

}