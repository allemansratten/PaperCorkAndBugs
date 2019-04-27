import {Player} from "./entity/Player"
import {Entity} from "./entity/Entity"
import {StationaryMonster} from "./entity/StationaryMonster"
import {Level} from "./Level"

export class Game {

    private entities: Entity[] = []

    private player: Player
    private level: Level

    constructor(private width: number, private height: number) {
        this.player = new Player(width / 2, height / 2)
        this.entities.push(this.player)
        for (let i = 0; i < 5; i++) {
            this.addMonsterRandom()
        }
    }

    private addMonsterRandom() {
        // const oldSize = this.monsters.length
        // do {
        const x = Math.random() * this.width
        const y = Math.random() * this.height
        // if (hypot(this.player.x - x, this.player.y - y) > this.width / 2)
        this.entities.push(new StationaryMonster(this.player, x, y))
        // } while (oldSize == this.monsters.length)
    }

    private resolveCollisions() {
        const friendly = this.entities.filter(entity => entity.friendly)
        const hostile = this.entities.filter(entity => !entity.friendly)

        const deadFriendly = friendly.filter(entity => hostile.some(e => e.collidesWith(entity)))
        const deadHostile = hostile.filter(entity => friendly.some(e => e.collidesWith(entity)))

        deadFriendly.forEach(e => e.die())
        deadHostile.forEach(e => e.die())
    }

    step(seconds: number) {
        this.entities = this.entities.filter(entity => entity.step(seconds, this.level))
        this.resolveCollisions()
    }

    drawAll(context: CanvasRenderingContext2D) {
        this.entities.forEach(entity => entity.draw(context))
    }

    handleKeyPress(event: KeyboardEvent) {
        console.log("event")
        this.player.x += 10
    }

    handleKeyRelease(event: KeyboardEvent) {
    }
}
