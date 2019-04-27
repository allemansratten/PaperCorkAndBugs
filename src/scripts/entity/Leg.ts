import {Drawable} from "../Drawable"
import {Vector} from "vector2d"
import {Player} from "./Player"
import {BodyPart} from "./BodyPart"
import {CircleHitbox} from "./CircleHitbox"

export class Leg extends BodyPart implements Drawable {

    private static readonly RADIUS = 30
    rot: number
    speed: number
    private baseWiggleOffset: number = Math.random() * 10

    constructor(pos: Vector) {
        super(pos, Leg.RADIUS, new CircleHitbox(Leg.RADIUS))
    }

    draw(context: CanvasRenderingContext2D): void {
        let time = Date.now()

        context.save()
        context.translate(this.pos.x, this.pos.y)
        context.rotate(this.rot + Math.sin(this.baseWiggleOffset + time / 100) * this.speed / Player.MAX_SPEED)
        context.fillStyle = "black"
        context.beginPath()
        context.fillRect(0, -2, 4, 10)
        context.ellipse(6, 9, 6, 2, 0, 2 * Math.PI, 2 * Math.PI * 3 / 4, false)
        context.fill()
        context.restore()
    }
}