import {Drawable} from "../Drawable"
import {Vector} from "vector2d"
import {BodyPart} from "./BodyPart"
import {CircleHitbox} from "./CircleHitbox"
import {ImageManager} from "../ImageManager"

export class Arm extends BodyPart implements Drawable {

    private static readonly RADIUS = 25
    private static readonly WIDTH = Arm.RADIUS * 1.2
    private static readonly HEIGHT = Arm.RADIUS * 0.8
    recoil: number = 10
    defaultDir: number
    private recoilState: number = -1
    private recoilStartTime: number = 0
    private recoilSinePrev: number = 0
    private static readonly ARM_COLOR = "#000000"

    constructor(pos: Vector, defaultDir: number) {
        super(pos, Arm.RADIUS, new CircleHitbox(Arm.RADIUS))
        this.defaultDir = defaultDir

    }

    draw(context: CanvasRenderingContext2D): void {
        let time = Date.now()

        context.save()
        context.translate(this.pos.x, this.pos.y)
        context.rotate(Math.PI * 2 / 13 * this.defaultDir - Math.PI / 2)
        if (this.recoilState !== -1) {
            let recoilSine = Math.sin((this.recoilStartTime - time) / 100)
            context.translate(-20 - recoilSine * 20, 0)
            if (this.recoilState == 0 && recoilSine <= this.recoilSinePrev) {
                this.recoilState = 1
            }
            if (this.recoilState == 1 && recoilSine >= this.recoilSinePrev) {
                this.recoilState = -1
            }
            this.recoilSinePrev = recoilSine
        }

        const img = ImageManager.get("arm1")
        context.drawImage(img, 0, 0, img.width, img.height,
            -Arm.WIDTH / 2, -Arm.HEIGHT / 2, Arm.WIDTH, Arm.HEIGHT)
        context.restore()
    }

    doRecoil(): void {
        this.recoilState = 0
        this.recoilSinePrev = 0
        this.recoilStartTime = Date.now()
    }

    getSpawnPoint(): Vector {
        return this.pos
    }
}
