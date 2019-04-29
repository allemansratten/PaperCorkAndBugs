import {Drawable} from "./Drawable"
import {Tile} from "./Tile"
import {ImageManager} from "./ImageManager"
import {Vector} from "vector2d"

export class Level implements Drawable {

    public static readonly TILE_SIZE = 80
    public static readonly PAD_TILES_COUNT = 7
    private static readonly MAP_SIZES = [12, 12, 12, 12, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    public width: number
    public height: number
    tiles: Tile[][]

    constructor(public levelNum: number) {
        const mapSizeIdx = Math.min(Level.MAP_SIZES.length, levelNum) - 1
        this.width = Level.MAP_SIZES[mapSizeIdx]
        this.height = Level.MAP_SIZES[mapSizeIdx]
        this.tiles = []
        for (let xi = 0; xi < this.width; xi++) {
            this.tiles.push([])
            for (let yi = 0; yi < this.height; yi++) {
                this.tiles[xi].push(new Tile(xi == 0 || yi == 0 || xi == this.width - 1 || yi == this.height - 1 || Math.random() < 0.1))
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

    generateValidPosNotCloseTo(r: number, pos: Vector, minDistance: number): Vector {
        while (true) {
            const coords = this.randomCoords()
            if (this.at(coords).obstacle) continue
            coords.mulS(Level.TILE_SIZE)
            coords.add(new Vector(
                r + Math.random() * (Level.TILE_SIZE - 2 * r),
                r + Math.random() * (Level.TILE_SIZE - 2 * r))
            )
            if (coords.clone().subtract(pos).length() < minDistance) continue
            return coords
        }
    }

    private randomCoords(): Vector {
        const x = Math.floor(Math.random() * this.width)
        const y = Math.floor(Math.random() * this.height)
        return new Vector(x, y)
    }

    draw(context: CanvasRenderingContext2D): void {
        // draw cork background
        const img_background = ImageManager.get("cork")
        context.drawImage(img_background, 0, 0, img_background.width, img_background.height,
            -Level.PAD_TILES_COUNT * Level.TILE_SIZE, -Level.PAD_TILES_COUNT * Level.TILE_SIZE,
            (this.width + 2 * Level.PAD_TILES_COUNT) * Level.TILE_SIZE, (this.height + 2 * Level.PAD_TILES_COUNT) * Level.TILE_SIZE)

        const img_pins = ImageManager.get("pins")


        for (let xi = 0; xi < this.width; xi++) {
            for (let yi = 0; yi < this.height; yi++) {
                const tile = this.tiles[xi][yi]
                if (tile.obstacle) {
                    context.globalAlpha = 0.8
                    context.drawImage(img_pins, 0, 0, img_pins.width, img_pins.height, 0 + xi * Level.TILE_SIZE, 0 + yi * Level.TILE_SIZE, Level.TILE_SIZE - 0, Level.TILE_SIZE - 0)
                    // context.globalAlpha = 0.8
                    // context.fillStyle = "rgb(50, 50, 50)"
                    // context.fillRect(xi * Level.TILE_SIZE, yi * Level.TILE_SIZE, Level.TILE_SIZE + 1, Level.TILE_SIZE + 1)
                    context.globalAlpha = 1
                } else {
                    // context.globalAlpha = 0.8
                    // context.fillStyle = "rgb(10, 100, 100)"
                    // context.fillRect(xi * Level.TILE_SIZE, yi * Level.TILE_SIZE, Level.TILE_SIZE + 1, Level.TILE_SIZE + 1)
                }
            }
        }


        // add pad tiles
        context.globalAlpha = 1
        for (let xi = -Level.PAD_TILES_COUNT - 1; xi < 1; xi++) {
            for (let yi = -Level.PAD_TILES_COUNT; yi < this.height + Level.PAD_TILES_COUNT; yi++) {
                context.fillStyle = "#444340"
                context.drawImage(img_pins, 0, 0, img_pins.width, img_pins.height, xi * Level.TILE_SIZE, yi * Level.TILE_SIZE, Level.TILE_SIZE - 0, Level.TILE_SIZE - 0)
                context.drawImage(img_pins, 0, 0, img_pins.width, img_pins.height, (this.width + Level.PAD_TILES_COUNT + xi) * Level.TILE_SIZE, yi * Level.TILE_SIZE, Level.TILE_SIZE - 0, Level.TILE_SIZE - 0)
            }
        }
        for (let yi = -Level.PAD_TILES_COUNT - 1; yi < 1; yi++) {
            for (let xi = 0; xi < this.width; xi++) {
                context.fillStyle = "#444340"
                context.drawImage(img_pins, 0, 0, img_pins.width, img_pins.height, xi * Level.TILE_SIZE, yi * Level.TILE_SIZE, Level.TILE_SIZE - 0, Level.TILE_SIZE - 0)
                context.drawImage(img_pins, 0, 0, img_pins.width, img_pins.height, xi * Level.TILE_SIZE, (this.height + Level.PAD_TILES_COUNT + yi) * Level.TILE_SIZE, Level.TILE_SIZE - 0, Level.TILE_SIZE - 0)
            }
        }
        context.globalAlpha = 1
    }
}
