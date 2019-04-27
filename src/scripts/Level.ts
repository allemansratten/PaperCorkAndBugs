import {Drawable} from "./Drawable"
import {Player} from "./entity/Player"

export class Level implements Drawable {

    public player: Player

    draw(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight)
    }

}