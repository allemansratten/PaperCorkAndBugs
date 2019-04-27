import {Monster} from "./Monster"
import {Player} from "./Player"
import {Level} from "../Level"
import {Vector} from "vector2d"
import {Entity} from "./Entity"

export class StationaryMonster extends Monster {

    private static readonly RADIUS = 20
    private static readonly ALIVE_COLOR = "#77a"
    private static readonly DEAD_COLOR = "#558"
    private static readonly HP = 100

    constructor(player: Player, pos: Vector) {
        super(player, pos, StationaryMonster.RADIUS, StationaryMonster.HP)
    }

    draw(context: CanvasRenderingContext2D): void {
        context.fillStyle = this.alive ? StationaryMonster.ALIVE_COLOR : StationaryMonster.DEAD_COLOR
        context.beginPath()
        context.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        context.fill()
    }

    step(seconds: number, level: Level): boolean {
        if (!this.alive) return true // leave a corpse for now
        return true
    }

    collideWith(entity: Entity): void {

    }
}