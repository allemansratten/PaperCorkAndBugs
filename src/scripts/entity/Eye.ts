import {Drawable} from "../Drawable"
import {Vector} from "vector2d"

export class Eye implements Drawable {

    pos : Vector
    r : number
    blinking : boolean

    constructor(pos: Vector, r: number) {
        this.pos = pos
        this.r = r
    }

    // readonly friendly: boolean = false
    // die(): void {   }

    draw(context: CanvasRenderingContext2D): void {
        // let time = Date.
        // super.draw(context)
        context.fillStyle = "#aaaaaa"
        context.beginPath()
        context.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        context.fill()
        context.fillStyle = "#222222"
        
        context.beginPath()
        context.arc(this.pos.x, this.pos.y, this.r/2, 0, 2 * Math.PI)
        context.fill()
    }
}
