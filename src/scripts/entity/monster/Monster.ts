import {Entity} from "../Entity"
import {Player} from "../Player"
import {Vector} from "vector2d"
import {CircleHitbox} from "../CircleHitbox"
import {Shot} from "../Shot"
import {Level} from "../../Level"
import {clamp} from "../../Util"

export abstract class Monster extends Entity {

    constructor(protected player: Player, pos: Vector, r: number, protected hp: number) {
        super(pos, r, new CircleHitbox(r))
    }

    readonly friendly: boolean = false
    protected timeSinceDeath: number = 0
    protected static readonly DEATH_TIME = 0.5

    alive(): boolean {
        return this.hp > 0
    }

    collideWith(entity: Entity): void {
        if (entity instanceof Shot) {
            this.hp--
        }
    }

    step(seconds: number, level: Level): boolean {
        if (!this.alive()) {
            this.timeSinceDeath += seconds
            return this.timeSinceDeath < 1
        }
        return true
    }

    getAlpha(): number {
        return clamp(1 - this.timeSinceDeath / Monster.DEATH_TIME, 0, 1)
    }
}
