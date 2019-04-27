import {Entity} from "./Entity"
import {Level} from "../Level"
import {Player} from "./Player"

export class Projectile extends Entity {

    constructor(private player: Player, x: number, y: number, r: number, public friendly: boolean) {
        super(x, y, r)

    }

    step(seconds: number, level: Level): boolean {
        return true
    }

    collidesWith(entity: Entity): boolean {
        return false
    }

    die(): void {
    }
}
