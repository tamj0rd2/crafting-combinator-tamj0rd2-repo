import {type LuaEntity, type LuaSurface, type SurfaceCreateEntity, type UnitNumber} from "factorio:runtime"
import constants from "../../constants"
import {CraftingCombinator} from "./crafting-combinator"

declare const global: {
	craftingCombinators: Record<UnitNumber, CraftingCombinator>
}

export class CraftingCombinators {
	static init() {
		global.craftingCombinators = global.craftingCombinators ?? {}
	}

	private static get craftingCombinators(): Record<UnitNumber, CraftingCombinator> {
		return global.craftingCombinators
	}

	static updateAll() {
		Object.values(this.craftingCombinators).forEach(combinator => combinator.update())
	}

	static create(surface: LuaSurface, params: Omit<SurfaceCreateEntity, "name" | "raise_built">) {
		const entity = assert(surface.create_entity({
			...params, name: constants.CRAFTING_COMBINATOR,
			raise_built: true
		}))
		assert(entity.valid)
		return this.craftingCombinators[assert(entity.unit_number)]
	}

	static registerExistingEntity(entity: LuaEntity) {
		const unitNumber = assert(entity.unit_number)
		this.craftingCombinators[unitNumber] = new CraftingCombinator(entity)
	}
}
