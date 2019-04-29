import {Level} from "../Level"
import {Entity} from "./Entity"
import {Ant} from "./monster/Ant"
import {Worm} from "./monster/Worm"
import {Wasp} from "./monster/Wasp"
import {Fly} from "./monster/Fly"
import {StagBeetle} from "./monster/StagBeetle"
import {Vector} from "vector2d"
import {Player} from "./Player"
import {Ladybug} from "./monster/Ladybug"
import {Mosquito} from "./monster/Mosquito"

export class MonsterGenerator {
    private static readonly LEVEL_MONSTERS_BASE = 10
    private static readonly LEVEL_MONSTERS_INCREMENT = 1
    private static readonly NEW_MONSTER_MIN_DIST = 250

    private static readonly MONSTER_TYPES = [Ant, Fly, StagBeetle, Wasp, Mosquito, Ladybug, Worm]
    private static readonly FIXED_LEVELS = [
        [1],
        [2],
        [3],
        [4],
        [2, 1],
        [2, 3],
        [3, 0, 1],
        [4, 1, 2],
        [0, 0, 4],
        [3, 0, 0, 2],
        [3, 2, 0, 3],
        [3, 2, 0, 2, 1],
        [3, 0, 0, 0, 4],
        [4, 2, 1, 1, 3],
        [4, 2, 1, 0, 0, 2],
        [4, 2, 1, 1, 1, 2],
        [0, 0, 0, 0, 0, 0, 2],
    ]

    static generateMonsters(level: Level, player: Player): Entity[] {
        const levelI = level.levelNum - 1
        const entities: Entity[] = []
        if (levelI < this.FIXED_LEVELS.length) {
            for (let i = 0; i < this.FIXED_LEVELS[levelI].length; i++) {
                for (let j = 0; j < this.FIXED_LEVELS[levelI][i]; j++) {
                    const toAdd = new (this.MONSTER_TYPES[i])(player, new Vector(0, 0))
                    toAdd.pos = level.generateValidPosNotCloseTo(toAdd.r, player.pos, this.NEW_MONSTER_MIN_DIST)
                    entities.push(toAdd)
                }
            }
        } else {
            const levelMonsters = (MonsterGenerator.LEVEL_MONSTERS_BASE +
                MonsterGenerator.LEVEL_MONSTERS_INCREMENT * (levelI - this.FIXED_LEVELS.length))
            while (entities.length < levelMonsters) {
                entities.push(this.addMonsterRandom(level, player))
            }
        }
        return entities
    }

    static randomMonsterType(level: Level) {
        const types = MonsterGenerator.MONSTER_TYPES
        return types[Math.floor(Math.random() * types.length)]
    }

    static addMonsterRandom(level: Level, player: Player): Entity {
        const toAdd = new (this.randomMonsterType(level))(player, new Vector(0, 0))
        toAdd.pos = level.generateValidPosNotCloseTo(toAdd.r, player.pos, this.NEW_MONSTER_MIN_DIST)
        return toAdd
    }
}