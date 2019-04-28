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
import {Fly} from "./entity/monster/Fly"
import {GameState} from "./GameState"

export class Game {

    private entities: Entity[] = []

    private player: Player
    private level: Level
    public pauseSymbol: PauseSymbol
    private gameState: GameState = GameState.IN_GAME

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
        const types = [StagBeetle, Wasp, Ant, Fly]
        return types[Math.floor(Math.random() * types.length)]
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
        if (this.gameState == GameState.IN_GAME) {
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
                this.entities.push(...entity.createdEntities)
                // console.log(this.entities)
                entity.createdEntities = []
            })
            if (!this.player.alive) this.gameState = GameState.GAME_OVER
        }
    }

    drawGame(context: CanvasRenderingContext2D) {
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
        this.drawHud(context)

    }

    drawAll(context: CanvasRenderingContext2D) {
        this.drawGame(context)
        switch (this.gameState) {
            case GameState.PAUSED:
                this.pauseSymbol.draw(context)
                break
            case GameState.LEVEL_END:
                break
            case GameState.GAME_OVER:
                /** SPOOOOOKY */
                context.textAlign = "center"
                context.font = '80px Sans-serif'
                context.strokeStyle = 'black'
                context.lineWidth = 8
                context.strokeText("GAME OVER", this.width / 2, this.height / 2)
                context.fillStyle = '#600'
                context.fillText("GAME OVER", this.width / 2, this.height / 2)
                context.textAlign = "start"
        }
    }

    private drawHud(context: CanvasRenderingContext2D) {
        context.font = "30px Arial"
        context.fillStyle = "#abc"
        context.fillText("Child stats:", 10, 30)
        context.fillText("eyes: " + this.player.childEyes, 10, 70)
        context.fillText("legs: " + this.player.childLegs, 10, 100)
        context.fillText("arms: " + this.player.childArms, 10, 130)
    }

    handleKeyPress(event: KeyboardEvent) {
        this.player.movementKeyState.handleKey(event.key.toLowerCase(), true)
        this.player.shootingKeyState.handleKey(event.key.toLowerCase(), true)
        if (event.key.toLowerCase() == 'p') {
            if (this.gameState == GameState.PAUSED) this.gameState = GameState.IN_GAME
            else if (this.gameState == GameState.IN_GAME) this.gameState = GameState.PAUSED
        }
    }

    handleKeyRelease(event: KeyboardEvent) {
        this.player.movementKeyState.handleKey(event.key.toLowerCase(), false)
        this.player.shootingKeyState.handleKey(event.key.toLowerCase(), false)
    }
}
