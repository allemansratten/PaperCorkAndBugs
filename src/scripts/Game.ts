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
import {Worm} from "./entity/monster/Worm"

export class Game {

    private entities: Entity[] = []

    private player: Player
    private level: Level
    public pauseSymbol: PauseSymbol
    private gameState: GameState = GameState.IN_GAME
    private endLevelContinueSelected: boolean = false
    private static readonly END_LEVEL_MENU_OPTION_1 = "Continue with this character"
    private static readonly END_LEVEL_MENU_OPTION_2 = "Kill parent and spawn a child"
    // private monstersKilledInLevel = 0
    private static readonly MONSTERS_TO_KILL_IN_LEVEL = 10
    private levelNum = 0

    constructor(private width: number, private height: number) {
        this.pauseSymbol = new PauseSymbol()
        this.nextLevel(true)
    }

    private nextLevel(createNewPlayer: boolean) {
        this.levelNum++
        // this.monstersKilledInLevel = 0
        this.endLevelContinueSelected = false
        this.entities = []
        if (createNewPlayer) this.player = this.nextPlayer()
        this.entities.push(this.player)
        this.level = new Level(20, 20)
        this.level.player = this.player
        for (let i = 0; i < 5; i++) {
            this.addMonsterRandom()
        }
        this.gameState = GameState.IN_GAME
    }

    private nextPlayer(): Player {
        if (this.player == undefined) {
            return new Player(new Vector(this.width / 2, this.height / 2), 6, 6, 6)
        } else {
            return new Player(new Vector(this.width / 2, this.height / 2), this.player.childEyes, this.player.childLegs, this.player.childArms)
        }
    }

    private randomMonsterType() {
        const types = [StagBeetle, Wasp, Ant, Fly, Worm]
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
            // this.monstersKilledInLevel += nKilled
            /* for (let i = 0; i < nKilled * 2; i++) {
                 this.addMonsterRandom()
             }*/
            this.resolveCollisions()
            // Add player's projectiles
            this.entities.forEach(entity => {
                this.entities.push(...entity.createdEntities)
                // console.log(this.entities)
                entity.createdEntities = []
            })
            if (!this.player.alive) {
                this.gameState = GameState.GAME_OVER
            }
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

    private drawEndLevelMenu(context: CanvasRenderingContext2D) {
        var option1 = Game.END_LEVEL_MENU_OPTION_1
        var option2 = Game.END_LEVEL_MENU_OPTION_2
        if (this.endLevelContinueSelected) {
            option1 = ">  " + option1
        } else {
            option2 = ">  " + option2
        }

        const x = this.width - 120
        const y = this.height / 2
        context.textAlign = "right"
        context.font = '30px Sans-serif'
        context.lineWidth = 8
        context.lineJoin = "bevel"

        context.strokeStyle = 'black'
        context.strokeText(option1, x, y - 30)
        context.fillStyle = '#1fc'
        context.fillText(option1, x, y - 30)

        context.strokeStyle = 'black'
        context.strokeText(option2, x, y + 30)
        context.fillStyle = '#600'
        context.fillText(option2, x, y + 30)

        context.textAlign = "start"

    }

    drawAll(context: CanvasRenderingContext2D) {
        this.drawGame(context)
        switch (this.gameState) {
            case GameState.PAUSED:
                this.pauseSymbol.draw(context)
                break
            case GameState.LEVEL_END:
                this.drawEndLevelMenu(context)
                break
            case GameState.GAME_OVER:
                const text = "GAME OVER"
                const x = this.width / 2
                const y = this.height / 2
                context.textAlign = "center"
                context.lineJoin = "bevel"
                context.font = '80px Sans-serif'
                context.strokeStyle = 'black'
                context.lineWidth = 8
                context.strokeText(text, x, y)
                context.fillStyle = '#600'
                context.fillText(text, x, y)
                context.textAlign = "start"
        }
        if (this.monstersLeft() == 0 && this.gameState != GameState.LEVEL_END) {
            const text = "press F to end level"
            const x = this.width / 2
            const y = this.height - 20
            context.textAlign = "center"
            context.lineJoin = "bevel"
            context.font = '30px Sans-serif'
            context.strokeStyle = 'black'
            context.lineWidth = 8
            context.strokeText(text, x, y)
            context.fillStyle = '#af0'
            context.fillText(text, x, y)
            context.textAlign = "start"
        }
    }

    private monstersLeft(): number {
        return this.entities.filter(e => e instanceof Monster).length
    }

    private drawHud(context: CanvasRenderingContext2D) {
        context.font = "30px Arial"
        context.fillStyle = "#abc"
        context.fillText("Level:" + this.levelNum, 10, 30)
        context.fillText("Monsters left: " + this.monstersLeft(), 10, 60)
        context.fillText("Child stats:", 10, 90)
        context.fillText("eyes: " + this.player.childEyes, 10, 120)
        context.fillText("legs: " + this.player.childLegs, 10, 150)
        context.fillText("arms: " + this.player.childArms, 10, 180)
    }

    handleKeyPress(event: KeyboardEvent) {
        this.player.movementKeyState.handleKey(event.key.toLowerCase(), true)
        this.player.shootingKeyState.handleKey(event.key.toLowerCase(), true)
        if (event.key.toLowerCase() == 'p') {
            if (this.gameState == GameState.PAUSED) this.gameState = GameState.IN_GAME
            else if (this.gameState == GameState.IN_GAME) this.gameState = GameState.PAUSED
        }
        if (this.gameState == GameState.LEVEL_END) {
            if (event.key.toLocaleLowerCase() == "arrowup" || event.key.toLocaleLowerCase() == "arrowdown") {
                this.endLevelContinueSelected = !this.endLevelContinueSelected
            } else if (event.key.toLocaleLowerCase() == "enter") {
                this.nextLevel(!this.endLevelContinueSelected)
            }
        }
        if (this.gameState == GameState.IN_GAME && this.monstersLeft() == 0 && event.key.toLocaleLowerCase() == "f") {
            this.gameState = GameState.LEVEL_END
        }
    }

    handleKeyRelease(event: KeyboardEvent) {
        this.player.movementKeyState.handleKey(event.key.toLowerCase(), false)
        this.player.shootingKeyState.handleKey(event.key.toLowerCase(), false)
    }
}
