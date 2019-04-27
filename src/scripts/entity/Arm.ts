import {Drawable} from "../Drawable"
import {Vector} from "vector2d"
import {BodyPart} from "./BodyPart"
import {CircleHitbox} from "./CircleHitbox"

export class Arm extends BodyPart implements Drawable {

    private static readonly RADIUS = 30
    recoil : number = 10
    defaultDir: number
    private recoilState : number = -1
    private recoilStartTime : number = 0
    private recoilSinePrev : number = 0
    private static readonly ARM_COLOR = "#000000"

    constructor(pos: Vector, defaultDir: number) {
        super(pos, Arm.RADIUS, new CircleHitbox(Arm.RADIUS))
        this.defaultDir = defaultDir

    }

    draw(context: CanvasRenderingContext2D): void {
        let time = Date.now()

        context.save()
        context.translate(this.pos.x, this.pos.y)
        if(this.recoilState == -1)
            context.rotate(Math.PI * 2 / 8 * this.defaultDir)
        else {
            let recoilSine = Math.sin((this.recoilStartTime - time) / 100)
            context.rotate(Math.PI * 2 / 8 * this.defaultDir)
            // context.rotate(Math.PI * 2 / 8 * this.defaultDir + (recoilSine*2))
            context.translate(0, -20-recoilSine*20)
            if (this.recoilState == 0 && recoilSine <= this.recoilSinePrev) {
                this.recoilState = 1
            }
            if (this.recoilState == 1 && recoilSine >= this.recoilSinePrev) {
                this.recoilState = -1
            }
            this.recoilSinePrev = recoilSine
        }


        context.fillStyle = Arm.ARM_COLOR
        context.beginPath()
        context.ellipse(0, 0, 2, 14, 0, 0, 2 * Math.PI)
        context.fill()
        context.restore()
    }

    doRecoil() : void {
        this.recoilState = 0
        this.recoilSinePrev = 0
        this.recoilStartTime = Date.now()
    }

    getSpawnPoint(): Vector {
        return this.pos
    }
}
