import {Player} from "./entity/Player"
import {Entity} from "./entity/Entity"
import {StationaryMonster} from "./entity/monster/StationaryMonster"
import {Level} from "./Level"
import {Vector} from "vector2d"
import {Hitbox} from "./entity/Hitbox"
import {StagBeetle} from "./entity/monster/StagBeetle"

export class Game {

    private entities: Entity[] = []

    private player: Player
    private level: Level

    constructor(private width: number, private height: number) {
        this.player = new Player(new Vector(width / 2, height / 2))
        this.entities.push(this.player)
        for (let i = 0; i < 5; i++) {
            this.addMonsterRandom()
        }
        this.level = new Level(20, 20)
        this.level.player = this.player
    }

    private addMonsterRandom() {
        // const oldSize = this.monsters.length
        // do {
        const x = Math.random() * this.width
        const y = Math.random() * this.height
        // if (hypot(this.player.x - x, this.player.y - y) > this.width / 2)
        this.entities.push(new StagBeetle(this.player, new Vector(x, y)))
        // } while (oldSize == this.monsters.length)
    }

    private resolveCollisions() {
        const friendly = this.entities.filter(entity => entity.friendly)
        const hostile = this.entities.filter(entity => !entity.friendly)

        friendly.forEach(friend => {
            hostile.forEach(enemy => {
                if (Hitbox.checkCollision(friend, enemy)) {
                    friend.collideWith(enemy)
                    enemy.collideWith(friend)
                }
            })
        })
    }

    step(seconds: number) {
        this.entities = this.entities.filter(entity => entity.step(seconds, this.level))
        this.resolveCollisions()
        // Add player's projectiles
        this.entities.push(...this.player.entitiesToAdd)
        // console.log(this.entities)
        this.player.entitiesToAdd = []
    }

    drawAll(context: CanvasRenderingContext2D) {
        context.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight)
        context.translate(-this.player.pos.x + this.width / 2, -this.player.pos.y + this.height / 2)
        this.level.draw(context)
        this.entities.forEach(entity => entity.draw(context))
        context.resetTransform()
    }

    handleKeyPress(event: KeyboardEvent) {
        this.player.movementKeyState.handleKey(event.key, true)
        this.player.shootingKeyState.handleKey(event.key, true)
    }

    handleKeyRelease(event: KeyboardEvent) {
        this.player.movementKeyState.handleKey(event.key, false)
        this.player.shootingKeyState.handleKey(event.key, false)
    }
}
