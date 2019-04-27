import {Drawable} from "../Drawable"
import {Level} from "../Level"

export abstract class Entity implements Drawable {

    constructor(public x: number, public y: number, public r: number) {
    }

    draw(context: CanvasRenderingContext2D): void {
    }

    /** returns false when the entity is dead and ready to be deleted */
    abstract step(seconds: number, level: Level): boolean;

    abstract collidesWith(entity: Entity): boolean

    abstract die(): void

    abstract friendly: boolean
}
