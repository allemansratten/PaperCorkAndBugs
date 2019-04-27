import {Drawable} from "../Drawable"
import {Level} from "../Level"
import {Vector} from "vector2d"

export abstract class Entity implements Drawable {

    constructor(public pos : Vector, public r: number) {
    }

    draw(context: CanvasRenderingContext2D): void {
    }

    /** returns false when the entity is dead and ready to be deleted */
    abstract step(seconds: number, level: Level): boolean;

    abstract collidesWith(entity: Entity): boolean

    abstract die(): void

    abstract friendly: boolean
}
