import {Drawable} from "./Drawable"
import {Player} from "./entity/Player"
import {Tile} from "./Tile"
import {ImageManager} from "./ImageManager"
import {Vector} from "vector2d"

export class Level implements Drawable {

    public player: Player
    public static readonly TILE_SIZE = 80
    tiles: Tile[][]

    constructor(public width: number, public height: number, public levelNum: number) {
        this.tiles = []
        for (let xi = 0; xi < width; xi++) {
            this.tiles.push([])
            for (let yi = 0; yi < height; yi++) {
                this.tiles[xi].push(new Tile(xi == 0 || yi == 0 || xi == width - 1 || yi == height - 1 || Math.random() < 0.1))
            }
        }
    }

    at(coords: Vector): Tile {
        return this.tiles[coords.x][coords.y]
    }

    generateValidPos(r: number): Vector {
        const INFINITY = 1e30
        return this.generateValidPosCloseTo(r, new Vector(0, 0), INFINITY)
    }

    generateValidPosCloseTo(r: number, pos: Vector, maxDistance: number): Vector {
        while (true) {
            const coords = this.randomCoords()
            if (this.at(coords).obstacle) continue
            coords.mulS(Level.TILE_SIZE)
            coords.add(new Vector(
                r + Math.random() * (Level.TILE_SIZE - 2 * r),
                r + Math.random() * (Level.TILE_SIZE - 2 * r))
            )
            if (coords.clone().subtract(pos).length() > maxDistance) continue
            return coords
        }
    }

    private randomCoords(): Vector {
        const x = Math.floor(Math.random() * this.width)
        const y = Math.floor(Math.random() * this.height)
        return new Vector(x, y)
    }

    draw(context: CanvasRenderingContext2D): void {
        const img_background = ImageManager.get("cork")
        // draw cork background
        context.drawImage(img_background, 0, 0, img_background.width, img_background.height, -300, -300, img_background.width, img_background.height)
        
        // add pad tiles
        const PAD_TILES_COUNT = 4
        context.globalAlpha = 0.8
        for(let xi = -PAD_TILES_COUNT; xi < 0; xi++) {
            for(let yi = -PAD_TILES_COUNT; yi < this.height+PAD_TILES_COUNT; yi++) {
                context.fillStyle = "#444340"
                context.fillRect(xi * Level.TILE_SIZE, yi * Level.TILE_SIZE, Level.TILE_SIZE + 1, Level.TILE_SIZE + 1)
                context.fillRect((this.width + PAD_TILES_COUNT + xi) * Level.TILE_SIZE, yi * Level.TILE_SIZE, Level.TILE_SIZE + 1, Level.TILE_SIZE + 1)
            }
        }        
        for(let yi = -PAD_TILES_COUNT; yi < 0; yi++) {
            for(let xi = 0; xi < this.width; xi++) {
                context.fillStyle = "#444340"
                context.fillRect(xi * Level.TILE_SIZE, yi * Level.TILE_SIZE, Level.TILE_SIZE + 1, Level.TILE_SIZE + 1)
                context.fillRect(xi * Level.TILE_SIZE, (this.height + PAD_TILES_COUNT + yi) * Level.TILE_SIZE, Level.TILE_SIZE + 1, Level.TILE_SIZE + 1)
            }
        }        
        context.globalAlpha = 1
        


        for (let xi = 0; xi < this.width; xi++) {
            for (let yi = 0; yi < this.height; yi++) {
                const tile = this.tiles[xi][yi]
                if (tile.obstacle) {
                    context.globalAlpha = 0.8
                    context.fillStyle = "rgb(50, 50, 50)"
                    context.fillRect(xi * Level.TILE_SIZE, yi * Level.TILE_SIZE, Level.TILE_SIZE + 1, Level.TILE_SIZE + 1)
                } else {
                    // context.globalAlpha = 0.8
                    // context.fillStyle = "rgb(10, 100, 100)"
                    // context.fillRect(xi * Level.TILE_SIZE, yi * Level.TILE_SIZE, Level.TILE_SIZE + 1, Level.TILE_SIZE + 1)
                }
                context.globalAlpha = 1
            }
        }
    }
}
