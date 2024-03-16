import type {LuaConstantCombinatorControlBehavior, LuaEntity, SignalID} from "factorio:runtime"
import constants from "../../constants"

/* This should be newed up via {@link CraftingCombinators} rather than here directly. Using this can lead to bugs */
export class CraftingCombinator {
	constructor(readonly entity: LuaEntity) {
		assert(entity.name === constants.CRAFTING_COMBINATOR, "entity must be a crafting combinator")
		assert(entity.valid, "entity must be valid")

		this._output = new CraftingCombinatorOutput(assert(entity.surface.create_entity({
			name: constants.CRAFTING_COMBINATOR_OUTPUT,
			position: entity.position,
			force: entity.force
		})), this)
	}

	private _output: CraftingCombinatorOutput

	update = () => {
		// find nearby assembling machines
		const assemblingMachines = this.entity.surface.find_entities_filtered({
			position: this.entity.position,
			// TODO: how can I set this to the width of the assembling machine? It might not always be 3.
			//  ideally I should be checking whether an entity is adjacent to the combinator
			radius: 3,
			type: "assembling-machine"
		})

		// TODO: maybe I can set some kind of indicator for when crafting combinator is near multiple assemblers.
		// or... maybe it's not a problem if a crafting combinator is sandwiched between 2 machines. It should probably
		// just set the recipe for both. Might be convenient for having pairs of assembling machines
		if (assemblingMachines.length !== 1) {
			this._output.resetSignal()
			return
		}

		const assemblingMachine = assemblingMachines[0]
		const recipe = this.chooseARecipeToCraftFor(assemblingMachine)

		// TODO: what to do with any input items and output items currently inside of the assembling machine?
		// TODO: I should let the assembling machine finish crafting before allowing the recipe to change.
		assemblingMachine.set_recipe(recipe)
		// TODO: don't hardcode item here. I think chemical plants count as crafting machines.
		this._output.setSignal({type: "item", name: recipe?.name}, 1)
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

	handleDestruction() {
		// TODO: delete the output entity
	}
}

export class CraftingCombinatorOutput {
	constructor(readonly entity: LuaEntity, parent: CraftingCombinator) {
		assert(entity.name === constants.CRAFTING_COMBINATOR_OUTPUT, "entity must be a crafting combinator output")
		assert(entity.valid, "entity must be valid")

		;[defines.wire_type.green, defines.wire_type.red].forEach(wireType => {
			entity.connect_neighbour({
				wire: wireType,
				target_entity: parent.entity,
				target_circuit_id: defines.circuit_connector_id.combinator_output
			})
		})
	}

	// TODO: make a variable for the cb
	setSignal = (signal: SignalID, count: number) => {
		const cb = this.entity.get_or_create_control_behavior()! as LuaConstantCombinatorControlBehavior
		cb.parameters = [{index: 1, signal, count}]
	}

	resetSignal = () => {
		const cb = this.entity.get_or_create_control_behavior()! as LuaConstantCombinatorControlBehavior
		cb.parameters = []
	}
}
