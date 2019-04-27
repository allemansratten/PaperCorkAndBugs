import {Drawable} from "./Drawable"

export abstract class Entity implements Drawable {

    constructor(public x: number, public y: number, public r: number) {
    }

    draw(context: CanvasRenderingContext2D): void {
    }

    abstract step(seconds: number): void;
}
