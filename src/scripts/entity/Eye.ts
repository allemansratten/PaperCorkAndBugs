import {Drawable} from "../Drawable"
import {Vector} from "vector2d"
import {BodyPart} from "./BodyPart"

export class Eye extends BodyPart implements Drawable {

    pos: Vector
    private r: number
    private blinkingState: number = -1
    private blinkingStartTime: number
    private blinkingSinePrev: number
    private blinkingLastTime: number = 0

    private static readonly WHITE_COLOR = "#888888"
    private static readonly IRIS_COLOR = "#222222"
    private static readonly EYELID_COLOR = "#6d371e"
    private static readonly BLINKING_INTERVAL = 1000
    private static readonly BLINKING_DURATION = 300


    constructor(pos: Vector, r: number) {
        super()
        this.pos = pos
        this.r = r
        this.blinkingLastTime = Date.now()
    }

    draw(context: CanvasRenderingContext2D): void {
        let time = Date.now()

        context.fillStyle = Eye.WHITE_COLOR
        context.beginPath()
        context.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        context.fill()
        context.fillStyle = Eye.IRIS_COLOR

        context.beginPath()
        context.arc(this.pos.x, this.pos.y, this.r / 2, 0, 2 * Math.PI)
        context.closePath()
        context.fill()

        // roll dice to start blinking
        if (this.blinkingState == -1) {
            // this is so that the probs wouldn't be frame dependent
            if (Math.random() > 1 - this.blinkingLastTime / time / Eye.BLINKING_INTERVAL) {
                this.blinkingState = 0
                this.blinkingSinePrev = 0
                this.blinkingStartTime = this.blinkingLastTime = Date.now()
            }
        } else {
            let blinkSine = Math.sin((this.blinkingStartTime - time) / Eye.BLINKING_DURATION)
            context.beginPath()
            // context.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * (1-blinkSine))
            context.ellipse(this.pos.x, this.pos.y, this.r, (1 + blinkSine) * this.r, 0, 0, 2 * Math.PI)
            context.fill()
            context.fillStyle = Eye.EYELID_COLOR
            if (this.blinkingState == 0 && blinkSine <= this.blinkingSinePrev) {
                this.blinkingState = 1
            }
            if (this.blinkingState == 1 && blinkSine >= this.blinkingSinePrev) {
                this.blinkingState = -1
            }
            this.blinkingSinePrev = blinkSine
        }
    }
}
