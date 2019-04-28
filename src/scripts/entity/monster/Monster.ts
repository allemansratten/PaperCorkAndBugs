import {Entity} from "../Entity"
import {Player} from "../Player"
import {Vector} from "vector2d"
import {CircleHitbox} from "../CircleHitbox"
import {Shot} from "../Shot"
import {Level} from "../../Level"
import {angleDistance, angleToVector, clamp, vectorToAngle} from "../../Util"
import {Leg} from "../Leg"
import {Eye} from "../Eye"
import {Arm} from "../Arm"

export abstract class Monster extends Entity {

    private static readonly BODY_PART_DROP_CHANCE = 0.5
    private static readonly PLAYER_ANGLE_WEIGHT = 30

    constructor(protected player: Player, pos: Vector, r: number, protected hp: number) {
        super(pos, r, new CircleHitbox(r))
    }

    readonly friendly: boolean = false
    protected timeSinceDeath: number = 0
    protected static readonly DEATH_TIME = 0.5
    protected static readonly PUSH_COEF = 0.2
    protected speed: Vector = new Vector(0,0)

    alive(): boolean {
        return this.hp > 0
    }

    collideWith(entity: Entity): void {
        if (entity instanceof Shot) {
            this.hp--
        }
    }

    abstract aliveStep(seconds: number, level: Level): void;

    step(seconds: number, level: Level): boolean {
        if (!this.alive() && this.timeSinceDeath == 0) {
            if (Math.random() < Monster.BODY_PART_DROP_CHANCE) {
                const partRand = Math.random()
                if (partRand < 1 / 3) {
                    this.createdEntities.push(new Leg(this.pos.clone() as Vector, this.player))
                } else if (partRand < 2 / 3) {
                    this.createdEntities.push(new Eye(this.pos.clone() as Vector, Eye.randomEyeSize() * 2, this.player))
                } else {
                    this.createdEntities.push(new Arm(this.pos.clone() as Vector, Math.PI * 2 * Math.random()), this.player)
                }
            }
        }
        if (!this.alive()) {
            this.timeSinceDeath += seconds
            return this.timeSinceDeath < 1
        } else {
            this.aliveStep(seconds, level)
            return true
        }
    }

    abstract aliveDraw(context: CanvasRenderingContext2D): void;

    draw(context: CanvasRenderingContext2D) {
        context.globalAlpha = this.getAlpha()
        this.aliveDraw(context)
        context.globalAlpha = 1
    }

    drawDebugCircle(context: CanvasRenderingContext2D, fill: any) {
        context.globalAlpha = 0.5
        context.strokeStyle = "#f00"
        context.lineWidth = 2
        context.beginPath()
        context.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI)
        context.stroke()
        if (fill) {
            context.fillStyle = fill
        }
        context.fill()
        context.globalAlpha = 1
    }

    getAlpha(): number {
        return clamp(1 - this.timeSinceDeath / Monster.DEATH_TIME, 0, 1)
    }

    protected angleToPlayer(): number {
        const delta = this.player.pos.clone().subtract(this.pos)
        return Math.atan2(delta.y, delta.x)
    }

    protected imageAngle(): number {
        const direction = (this.speed.clone()
            .add(angleToVector(this.angleToPlayer()).mulS(Monster.PLAYER_ANGLE_WEIGHT)))
        // Add Math.PI / 2 because images are turned up
        return vectorToAngle(direction) + Math.PI / 2
    }

    protected static getCloserAngle(current: number, target: number, maxDelta: number): number {
        const delta = Math.min(angleDistance(target, current), maxDelta)
        const a1 = current + delta
        const a2 = current - delta
        if (angleDistance(a1, target) < angleDistance(a2, target)) {
            return a1
        } else {
            return a2
        }
    }

    static pushAway(m1: Monster, m2: Monster) {
        if (m1.pos.equals(m2.pos)) {
            return
        }
        let delta = m1.pos.clone().subtract(m2.pos)
        let minDelta = delta.clone().normalise().mulS(m1.r + m2.r)
        if (delta.length() < minDelta.length()) {
            let overlap = delta.subtract(minDelta)
            // console.log(overlap)
            m1.pos.subtract(overlap.clone().mulS(Monster.PUSH_COEF))
            m2.pos.add(overlap.clone().mulS(Monster.PUSH_COEF))
        }
    }
}
