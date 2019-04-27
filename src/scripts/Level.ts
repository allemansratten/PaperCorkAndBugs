import {Drawable} from "./Drawable"
import {Player} from "./entity/Player"
import {Tile} from "./Tile"

export class Level implements Drawable {

    public player: Player
    public static readonly TILE_SIZE = 60
    tiles : Tile[][]

    constructor(public width : number, public height : number) {
        this.tiles = []
        for (let xi = 0; xi < width; xi++) {
            this.tiles.push([])
            for (let yi = 0; yi < height; yi++) {
                this.tiles[xi].push(new Tile(Math.random() < 0.1))
            }
        }
    }

    draw(context: CanvasRenderingContext2D): void {
        for (let xi = 0; xi < this.width; xi++) {
            for (let yi = 0; yi < this.height; yi++) {
                const tile = this.tiles[xi][yi]
                if (tile.obstacle) {
                    context.fillStyle = "rgb(50,50,50)"
                } else {
                    context.fillStyle = "rgb(10, 100, 100)"
                }
                context.fillRect(xi * Level.TILE_SIZE, yi * Level.TILE_SIZE, Level.TILE_SIZE, Level.TILE_SIZE)
            }
        }
    }

}