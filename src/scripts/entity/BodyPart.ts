import {Entity} from "./Entity"
import {Level} from "../Level"

export abstract class BodyPart extends Entity {
    friendly: boolean = false

    collideWith(entity: Entity): void {
    }

    step(seconds: number, level: Level): boolean {
        return true
    }
}
