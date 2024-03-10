import {LuaEntity, LuaRecipe, LuaSurface, SurfaceCreateEntity, UnitNumber} from "factorio:runtime"
import {CRAFTING_COMBINATOR} from "../../constants"

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
			...params, name: CRAFTING_COMBINATOR,
			raise_built: true
		}))
		return this.craftingCombinators[assert(entity.unit_number)]
	}

	static registerExistingEntity(entity: LuaEntity) {
		const unitNumber = assert(entity.unit_number)
		this.craftingCombinators[unitNumber] = new CraftingCombinator(entity)
	}
}

/* This should be newed up via {@link CraftingCombinators} rather than here directly. Using this can lead to bugs */
export class CraftingCombinator {
	constructor(readonly entity: LuaEntity) {
		assert(entity.name === CRAFTING_COMBINATOR, "entity must be a crafting combinator")
		assert(entity.valid, "entity must be valid")
	}

	private _recipe?: LuaRecipe = undefined
	public get recipe(): LuaRecipe | undefined {
		return this._recipe
	}

	update = () => {
		// find nearby assembling machines
		const assemblingMachines = this.entity.surface.find_entities_filtered({
			position: this.entity.position,
			// TODO: how can I set this to the width of the assembling machine? It might not always be 3.
			//  ideally I should be checking whether an entity is adjacent to the combinator
			radius: 3,
			type: "assembling-machine"
		})

		if (assemblingMachines.length !== 1) {
			// TODO: if there are no assembling machines nearby, I should probably reset the combinator's output
			// TODO: maybe I can set some kind of indicator for when crafting combinator is near multiple assemblers.
			// or... maybe it's not a problem if a crafting combinator is sandwiched between 2 machines. It should probably
			// just set the recipe for both. Might be convenient for having pairs of assembling machines
		}

		const assemblingMachine = assemblingMachines[0]
		const recipe = this.chooseARecipeToCraftFor(assemblingMachine)

		// TODO: persist the recipe somewhere - needs to be in global to work between saves
		//   actually, i may not need to put it in global. if there's an incoming circuit connection, that's enough to figure it out
		this._recipe = recipe

		// TODO: what to do with any input items and output items currently inside of the assembling machine?
		// TODO: I should let the assembling machine finish crafting before allowing the recipe to change.
		assemblingMachine.set_recipe(recipe)
	}

	private chooseARecipeToCraftFor = (otherEntity: LuaEntity) => {
		const networkSignals = [
			...this.entity.get_circuit_network(defines.wire_type.red, defines.circuit_connector_id.combinator_input)?.signals || [],
			...this.entity.get_circuit_network(defines.wire_type.green, defines.circuit_connector_id.combinator_input)?.signals || []
		]

		if (networkSignals.length === 0) return

		// TODO: I should make sure the assembling machine is able to produce this kind of recipe
		// can do this by checking which recipe categories it supports
		const thingToCraft = networkSignals[0].signal.name
		if (thingToCraft === undefined) return

		return otherEntity.force.recipes[thingToCraft]
	}
}
