import {Drawable} from "../Drawable"
import {Vector} from "vector2d"

export class Arm implements Drawable {

    pos : Vector
    dir : number
    defaultDir : number

    constructor(pos: Vector, defaultDir: number) {
        this.pos = pos
        this.defaultDir = defaultDir
    }

    draw(context: CanvasRenderingContext2D): void {
        context.save()
        context.translate(this.pos.x, this.pos.y)
        context.rotate(this.defaultDir*Math.PI*2/8)
        context.fillStyle = "black"
        context.beginPath()
        context.fillRect(0,-2, 4, 10)
        // context.ellipse(6, 9, 6, 2, 0, 2*Math.PI, 2*Math.PI*3/4, false)
        // context.fill()
        context.restore()
    }
}
