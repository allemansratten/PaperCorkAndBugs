import {Game} from "./Game"
import {ImageManager} from "./ImageManager"


const GAME_WINDOW_SIZE : number = 600
const canvas: HTMLCanvasElement = document.getElementById('game_canvas') as HTMLCanvasElement
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
canvas.width = GAME_WINDOW_SIZE
canvas.height = GAME_WINDOW_SIZE

ImageManager.loadAll()

let game: Game = new Game(GAME_WINDOW_SIZE, GAME_WINDOW_SIZE)
document.body.onkeydown = (event: KeyboardEvent) => {
    game.handleKeyPress(event)
}
document.body.onkeyup = (event: KeyboardEvent) => {
    game.handleKeyRelease(event)
}

let lastTime = Date.now()

function update() {
    let curTime = Date.now()
    let seconds = Math.min((curTime - lastTime) / 1000, 0.1)
    lastTime = curTime
    game.step(seconds)
    game.drawAll(ctx)
    window.requestAnimationFrame(update)
}

window.requestAnimationFrame(update)
