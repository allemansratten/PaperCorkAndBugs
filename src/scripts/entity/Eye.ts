import {Drawable} from "../Drawable"
import {Vector} from "vector2d"
import {BodyPart} from "./BodyPart"
import {CircleHitbox} from "./CircleHitbox"
import {ImageManager} from "../ImageManager"
import {Player} from "./Player"

export class Eye extends BodyPart implements Drawable {

    private blinkingState: number = -1
    private blinkingStartTime: number
    private blinkingSinePrev: number
    private blinkingLastTime: number = 0

    private static readonly EYELID_COLOR = "#c6c4c2"
    private static readonly BLINKING_INTERVAL = 600
    private static readonly BLINKING_DURATION = 300

    constructor(pos: Vector, r: number, magnet: Player = null) {
        super(pos, r, new CircleHitbox(r))
        this.blinkingLastTime = Date.now()
        this.magnet = magnet
    }

    static randomEyeSize(): number {
        return 10 + (Math.random() - 0.5) * 2.5
    }

    draw(context: CanvasRenderingContext2D): void {
        let time = Date.now()

        const img = ImageManager.get("eye1")
        context.drawImage(img, 0, 0, img.width, img.height,
            this.pos.x - this.r, this.pos.y - this.r, this.r * 2, this.r * 2)

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
            context.arc(this.pos.x, this.pos.y, this.r, Math.PI - blinkSine*1.1,  +blinkSine*1.1)
            // context.ellipse(this.pos.x, this.pos.y, this.r, (1 + blinkSine) * this.r, 0, 0, 2 * Math.PI)
            context.fillStyle = Eye.EYELID_COLOR
            context.fill()
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
