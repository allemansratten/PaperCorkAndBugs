import {Drawable} from "../Drawable"
import {Vector} from "vector2d"

export class Arm implements Drawable {

    pos : Vector
    defaultDir : number
    private static readonly ARM_COLOR = "#7a3d21"


    constructor(pos: Vector, defaultDir: number) {
        this.pos = pos
        this.defaultDir = defaultDir
    }

    draw(context: CanvasRenderingContext2D): void {
        context.save()
        context.translate(this.pos.x, this.pos.y)
        context.rotate(Math.PI*2/8*this.defaultDir)
        context.fillStyle = Arm.ARM_COLOR
        context.beginPath()
        context.ellipse(0, 0, 3, 10, 0, 0, 2*Math.PI)
        context.fill()
        
        context.fillStyle = Arm.ARM_COLOR
        context.ellipse(0, 0, 5, 5, 0, 0, 2*Math.PI)
        context.fill()

        context.restore()
    }

    getSpawnPoint() : Vector {
        return this.pos
    }
}
