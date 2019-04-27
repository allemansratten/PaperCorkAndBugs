import {Entity} from "./Entity"
import {Player} from "./Player"

export abstract class Monster extends Entity {

    protected alive: boolean = true

    constructor(protected player: Player, x: number, y: number, r: number) {
        super(x, y, r)
    }

    readonly friendly: boolean = false

    die(): void {
        this.alive = false
    }
}
