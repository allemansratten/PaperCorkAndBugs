import {Drawable} from '../Drawable'

export class PauseSymbol implements Drawable {

    private static readonly RADIUS: number = 10

    constructor() {
    }

    draw(context: CanvasRenderingContext2D): void {
        context.fillStyle = '#FFFFFF'
        context.beginPath()
        context.fillRect(550, 30, 20, 80)
        context.fillRect(510, 30, 20, 80)
        context.fill()
    }
}