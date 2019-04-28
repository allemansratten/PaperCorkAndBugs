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

export class MonsterGenerator {
    private static readonly FIRST_LEVEL_MONSTERS = 5
    private static readonly LEVEL_MONSTERS_INCREMENT = 0.4
    private static readonly NEW_MONSTER_MIN_DIST = 250
    private static readonly LEVEL_MONSTERS = [
        [Ant],
        [Ant, Fly],
        [Ant, Fly, StagBeetle],
        [Ant, Fly, StagBeetle, Wasp],
        [Ant, Fly, StagBeetle, Wasp],
        [Ant, Fly, StagBeetle, Wasp, Worm],
        [Ant, Fly, StagBeetle, Wasp, Worm],
        [Ant, Fly, StagBeetle, Wasp, Worm, Ladybug],
    ]

    static generateMonsters(level: Level, player: Player): Entity[] {
        const entities: Entity[] = []
        if (level.levelNum <= this.LEVEL_MONSTERS.length) {
            /** make sure the new monster shows up */
            const monsterTypes = this.LEVEL_MONSTERS[level.levelNum - 1]
            const toAdd = new (monsterTypes[monsterTypes.length - 1])(player, new Vector(0, 0))
            toAdd.pos = level.generateValidPosNotCloseTo(toAdd.r, player.pos, this.NEW_MONSTER_MIN_DIST)
            entities.push(toAdd)
        }
        while (entities.length < MonsterGenerator.FIRST_LEVEL_MONSTERS + MonsterGenerator.LEVEL_MONSTERS_INCREMENT * (level.levelNum - 1)) {
            entities.push(this.addMonsterRandom(level, player))
        }
        return entities
    }

    static randomMonsterType(level: Level) {
        const levelTypeIdx = Math.min(level.levelNum, MonsterGenerator.LEVEL_MONSTERS.length) - 1
        const types = MonsterGenerator.LEVEL_MONSTERS[levelTypeIdx]
        return types[Math.floor(Math.random() * types.length)]
    }

    static addMonsterRandom(level: Level, player: Player): Entity {
        const toAdd = new (this.randomMonsterType(level))(player, new Vector(0, 0))
        toAdd.pos = level.generateValidPosNotCloseTo(toAdd.r, player.pos, this.NEW_MONSTER_MIN_DIST)
        return toAdd
    }
}