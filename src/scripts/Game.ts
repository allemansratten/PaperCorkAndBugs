import {Player} from "./entity/Player"
import {Entity} from "./entity/Entity"
import {Level} from "./Level"
import {Vector} from "vector2d"
import {PauseSymbol} from "./entity/PauseSymbol"
import {Hitbox} from "./entity/Hitbox"
import {StagBeetle} from "./entity/monster/StagBeetle"
import {Ant} from "./entity/monster/Ant"
import {Monster} from "./entity/monster/Monster"
import {Wasp} from "./entity/monster/Wasp"

export class Game {

    private entities: Entity[] = []

    private player: Player
    private level: Level
    public pauseSymbol: PauseSymbol
    public paused: boolean = false

    constructor(private width: number, private height: number) {
        this.player = new Player(new Vector(width / 2, height / 2))
        this.entities.push(this.player)
        this.level = new Level(20, 20)
        this.level.player = this.player
        for (let i = 0; i < 5; i++) {
            this.addMonsterRandom()
        }
        this.pauseSymbol = new PauseSymbol()
    }

    private randomMonsterType() {
        const x = Math.random()
        if (x < 0.33) {
            return StagBeetle
        } else if (x < 0.66) {
            return Wasp
        } else {
            return Ant
        }
    }

    private addMonsterRandom() {
        let success = false
        do {
            const x = Math.random() * this.level.width * Level.TILE_SIZE
            const y = Math.random() * this.level.height * Level.TILE_SIZE
            const toAdd = new (this.randomMonsterType())(this.player, new Vector(x, y))

            this.entities.push(toAdd)
            success = true
        } while (!success)
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
        let nKilled = 0
        this.entities = this.entities.filter(entity => {
            const died = entity.step(seconds, this.level)
            if (!died && entity instanceof Monster) {
                nKilled++
            }
            return died
        })
        for (let i = 0; i < nKilled * 2; i++) {
            this.addMonsterRandom()
        }
        this.resolveCollisions()
        // Add player's projectiles
        this.entities.forEach(entity => {
            this.entities.push(...entity.droppedEntities)
        })
        // console.log(this.entities)
        this.player.droppedEntities = []
    }

    drawAll(context: CanvasRenderingContext2D) {
        context.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight)
        const zoom = this.player.getZoom()
        context.scale(zoom, zoom)
        context.translate(
            -this.player.pos.x + this.width / 2 / zoom,
            -this.player.pos.y + this.height / 2 / zoom,
        )

        this.level.draw(context)
        this.entities.forEach(entity => entity.draw(context))

        context.resetTransform()
    }

    handleKeyPress(event: KeyboardEvent) {
        this.player.movementKeyState.handleKey(event.key.toLowerCase(), true)
        this.player.shootingKeyState.handleKey(event.key.toLowerCase(), true)
        if(event.key.toLowerCase() == 'p') {
            this.paused = !this.paused;
        }
    }

    handleKeyRelease(event: KeyboardEvent) {
        this.player.movementKeyState.handleKey(event.key.toLowerCase(), false)
        this.player.shootingKeyState.handleKey(event.key.toLowerCase(), false)
    }
}
