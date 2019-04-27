import {Entity} from "./Entity"
import {Level} from "../Level"
import {Player} from "./Player"

export abstract class BodyPart extends Entity {
    friendly: boolean = false
    pickedUp: boolean = false

    collideWith(entity: Entity): void {
        if (entity instanceof Player) this.pickedUp = true
    }

    step(seconds: number, level: Level): boolean {
        return !this.pickedUp
    }
}
