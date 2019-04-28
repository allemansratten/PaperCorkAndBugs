import {Drawable} from "./Drawable"
import {Player} from "./entity/Player"
import {Tile} from "./Tile"
import {ImageManager} from "./ImageManager"
import {Vector} from "vector2d"

export class Level implements Drawable {

    public player: Player
    public static readonly TILE_SIZE = 80
    tiles: Tile[][]

    constructor(public width: number, public height: number) {
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
        for (let xi = 0; xi < this.width; xi++) {
            for (let yi = 0; yi < this.height; yi++) {
                const tile = this.tiles[xi][yi]
                const img = ImageManager.get("harold")
                context.drawImage(img, 0, 0, img.width, img.height,
                    xi * Level.TILE_SIZE, yi * Level.TILE_SIZE, Level.TILE_SIZE + 4, Level.TILE_SIZE + 4)
                context.globalAlpha = 0.8
                if (tile.obstacle) {
                    context.fillStyle = "rgb(50,50,50)"

                } else {
                    context.fillStyle = "rgb(10, 100, 100)"
                }
                context.fillRect(xi * Level.TILE_SIZE, yi * Level.TILE_SIZE, Level.TILE_SIZE + 1, Level.TILE_SIZE + 1)
                context.globalAlpha = 1
            }
        }
    }
}
