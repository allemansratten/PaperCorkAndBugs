import {Game} from "./Game"
import {ImageManager} from "./ImageManager"

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
canvas.width = ctx.canvas.clientWidth
canvas.height = ctx.canvas.clientHeight

ImageManager.add("harold", "../assets/harold.jpg")

let game: Game = new Game(600, 600)
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
