import {Player} from "./Player"
import {Entity} from "./Entity"
import {FollowMonster} from "./FollowMonster"
import {hypot} from "./Util"

export class Game {

    private monsters: Entity[] = []

    private player: Player

    constructor(private width: number, private height: number) {
        this.player = new Player(width / 2, height / 2)
        for (let i = 0; i < 5; i++) {
            this.addMonsterRandom()
        }
    }

    private addMonsterRandom() {
        const oldSize = this.monsters.length
        do {
            const x = Math.random() * this.width
            const y = Math.random() * this.height
            if (hypot(this.player.x - x, this.player.y - y) > this.width / 2)
                this.monsters.push(new FollowMonster(this.player, x, y))
        } while (oldSize == this.monsters.length)
    }

    step(seconds: number) {
        this.player.step(seconds)
        this.monsters.forEach(entity => entity.step(seconds))
    }

    drawAll(context: CanvasRenderingContext2D) {
        this.player.draw(context)
        this.monsters.forEach(entity => entity.draw(context))
    }

    handleKeyPress(event: KeyboardEvent) {
        this.player.movementKeyState.handleKey(event.key, true)
    }

    handleKeyRelease(event: KeyboardEvent) {
        this.player.movementKeyState.handleKey(event.key, false)
    }
}
