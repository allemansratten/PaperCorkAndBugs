import {Drawable} from "../Drawable"
import {Vector} from "vector2d"

export class Arm implements Drawable {

    pos : Vector

    constructor(pos: Vector) {
        this.pos = pos
    }

    draw(context: CanvasRenderingContext2D): void {
        context.fillStyle = "black"
        context.fillRect(this.pos.x, this.pos.y, 10, 2)
    }
}
