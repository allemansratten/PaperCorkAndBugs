import {Projectile} from "./Projectile"
import {Entity} from "./Entity"
import {Level} from "../Level"
import {Player} from "./Player"
import {Vector} from "vector2d"

export class Shot extends Projectile {

    private static readonly RADIUS : number = 10
    private static readonly SPEED : number = 500
    private static readonly DURATION : number = 1 // How many seconds does the shot stay alive?
    protected alive: boolean = true
    private speed : Vector
    private duration : number

    constructor(protected player: Player, pos: Vector, dir : Vector) {
        // super(pos, Shot.RADIUS, new CircleHitbox(Shot.RADIUS),
        super(player, pos, Shot.RADIUS, true)
        this.speed = dir.normalise().mulS(Shot.SPEED)
        this.duration = Shot.DURATION
    }

    collideWith(entity: Entity): void {
        if (entity.friendly !== this.friendly) {
            this.alive = false
        }
    }

    step(seconds: number, level: Level): boolean {
        this.duration -= seconds
        if (this.duration <= 0) {
            this.alive = false
        }
        this.pos.add(this.speed.clone().mulS(seconds))
        return this.alive
    }

    draw(context: CanvasRenderingContext2D): void {
        // console.log("yes")
        // console.log(this.pos.toString())
        super.draw(context)
        context.fillStyle = 'rgb(230,230,230)'
        context.beginPath()
        context.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        context.fill()
    }
}