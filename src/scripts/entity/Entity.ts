import {Drawable} from "../Drawable"
import {Level} from "../Level"
import {Vector} from "vector2d"
import {Hitbox} from "./Hitbox"

export abstract class Entity implements Drawable {

    droppedEntities: Entity[] = [] // For entities produced by the player

    private readonly BOX_DIRECTIONS = [[-1, 0], [0, -1], [0, 1], [1, 0]]
    private readonly CORNER_DIRECTION_COORDS = [[-1, -1, 0, 0], [-1, 1, 0, 1], [1, -1, 1, 0], [1, 1, 1, 1]]

    constructor(public pos: Vector, public r: number, public hitbox: Hitbox) {
    }

    /** default implementation for round entities. returns true if a collision happened */
    protected resolveLevelCollision(level: Level, moveDirection: Vector): boolean {
        let didCollide = false
        const levelX = Math.floor(this.pos.x / Level.TILE_SIZE)
        const levelY = Math.floor(this.pos.y / Level.TILE_SIZE)

        this.BOX_DIRECTIONS.forEach(direction => {
            const tileX = levelX + direction[0]
            const tileY = levelY + direction[1]
            if (!(tileX < 0 || tileY < 0 || tileX >= level.width || tileY >= level.height) && level.tiles[tileX][tileY].obstacle) {
                if (levelX < tileX && this.pos.x + this.r > tileX * Level.TILE_SIZE) {
                    this.pos.x = tileX * Level.TILE_SIZE - this.r
                    didCollide = true
                }
                if (levelY < tileY && this.pos.y + this.r > tileY * Level.TILE_SIZE) {
                    this.pos.y = tileY * Level.TILE_SIZE - this.r
                    didCollide = true
                }
                if (levelX > tileX && this.pos.x - this.r < (tileX + 1) * Level.TILE_SIZE) {
                    this.pos.x = (tileX + 1) * Level.TILE_SIZE + this.r
                    didCollide = true
                }
                if (levelY > tileY && this.pos.y - this.r < (tileY + 1) * Level.TILE_SIZE) {
                    this.pos.y = (tileY + 1) * Level.TILE_SIZE + this.r
                    didCollide = true
                }
            }
        })
        if (moveDirection.length() === 0) return didCollide
        this.CORNER_DIRECTION_COORDS.forEach(direction => {
            const tileX = levelX + direction[0]
            const tileY = levelY + direction[1]
            const cornerX = (levelX + direction[2]) * Level.TILE_SIZE
            const cornerY = (levelY + direction[3]) * Level.TILE_SIZE
            const corner = new Vector(cornerX, cornerY)
            if (!(tileX < 0 || tileY < 0 || tileX >= level.width || tileY >= level.height) && level.tiles[tileX][tileY].obstacle) {
                const noOverlap = this.pos.clone().subtract(corner)

                if (noOverlap.length() < this.r) {
                    this.pos = corner.clone().add(noOverlap.normalise().mulS(this.r)) as Vector
                    didCollide = true
                }
            }
        })
        return didCollide
    }

    draw(context: CanvasRenderingContext2D): void {
    }

    /** returns false when the entity is dead and ready to be deleted */
    abstract step(seconds: number, level: Level): boolean;

    abstract collideWith(entity: Entity): void

    abstract friendly: boolean
}
