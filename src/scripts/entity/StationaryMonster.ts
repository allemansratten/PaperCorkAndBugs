import {Monster} from "./Monster"
import {Player} from "./Player"
import {Level} from "../Level"
import {Entity} from "./Entity"

export class StationaryMonster extends Monster {

    private static readonly RADIUS = 20
    private static readonly ALIVE_COLOR = "#77a"
    private static readonly DEAD_COLOR = "#558"

    constructor(player: Player, x: number, y: number) {
        super(player, x, y, StationaryMonster.RADIUS)
    }

    draw(context: CanvasRenderingContext2D): void {
        context.fillStyle = this.alive ? StationaryMonster.ALIVE_COLOR : StationaryMonster.DEAD_COLOR
        context.beginPath()
        context.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
        context.fill()
    }


    step(seconds: number, level: Level): boolean {
        if (!this.alive) return true // leave a corpse for now
        return true
    }

    collidesWith(entity: Entity): boolean {
        return false
    }

}