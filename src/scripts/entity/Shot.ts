import {Projectile} from "./Projectile"
import {Entity} from "./Entity"
import {Level} from "../Level"
import {Player} from "./Player"
import {Vector} from "vector2d"
import {BodyPart} from "./BodyPart"
import {Monster} from "./monster/Monster"

export class Shot extends Projectile {

    private static readonly RADIUS: number = 10
    private static readonly SPEED: number = 500
    private static readonly DURATION: number = 1 // How many seconds does the shot stay alive?
    alive: boolean = true
    private speed: Vector
    private duration: number

    constructor(protected player: Player, pos: Vector, dir: Vector, friendly: boolean, speed: number) {
        // super(pos, Shot.RADIUS, new CircleHitbox(Shot.RADIUS),
        super(player, pos.clone() as Vector, Shot.RADIUS, friendly)
        this.speed = dir.normalise().mulS(speed)
        this.duration = Shot.DURATION
    }

    collideWith(entity: Entity): void {
        if (entity.friendly !== this.friendly &&
            (entity instanceof Monster && (entity as Monster).alive()) ||
            (entity instanceof Player && (entity as Player).alive)) {
            this.alive = false
        }
    }

    step(seconds: number, level: Level): boolean {
        this.duration -= seconds
        if (this.duration <= 0) {
            this.alive = false
        }
        this.pos.add(this.speed.clone().mulS(seconds))
        if (this.resolveLevelCollision(level, this.speed)) this.alive = false
        return this.alive
    }

    draw(context: CanvasRenderingContext2D): void {
        super.draw(context)
        context.fillStyle = this.friendly ? 'rgb(230,230,230)' : 'rgb(160,50,50)'
        context.beginPath()
        context.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        context.fill()
    }
}