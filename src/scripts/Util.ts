import {AbstractVector, Vector} from "vector2d"

export function hypot(x: number, y: number): number {
    return Math.sqrt(x ** 2 + y ** 2)
}

export function angleDistance(a1: number, a2: number): number {
    const dif1 = Math.abs(a1 - a2)
    const dif2 = Math.abs(a1 - a2 - Math.PI * 2)
    const dif3 = Math.abs(a1 - a2 + Math.PI * 2)
    return Math.min(dif1, dif2, dif3)
}

export function clamp(a: number, mn: number, mx: number): number {
    return Math.min(mx, Math.max(mn, a))
}

export function interpolateLinear(fr: number, to: number, progress: number) {
    return fr * (1 - progress) + to * progress
}

export function angleToVector(angle: number) {
    return new Vector(Math.cos(angle), Math.sin(angle))
}

export function vectorToAngle(v: AbstractVector) {
    return Math.atan2(v.y, v.x)
}

export function shuffleArray(array: Array<number>) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}

export function randFromArray(items: Array<number>) {
    return items[Math.floor(Math.random()*items.length)];
}

export class Smoother {
    a_fr: number
    a_to: number
    progress: number

    constructor(a: number, public duration: number) {
        this.a_fr = a
        this.a_to = a
        this.progress = 0
    }

    get() {
        return this.a_fr * (1 - this.progress) + this.a_to * this.progress
    }

    step(seconds: number) {
        this.progress = clamp(this.progress + seconds / this.duration, 0, 1)
    }

    setTarget(a: number) {
        if (a !== this.a_to) {
            this.a_fr = this.get()
            this.a_to = a
            this.progress = 0
        }
    }

}