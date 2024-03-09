import {LuaArithmeticCombinatorControlBehavior, LuaEntity} from "factorio:runtime"
import {CRAFTING_COMBINATOR} from "../constants"

script.on_nth_tick(60, () => {
	const combinators = findAllCombinators()

	combinators.forEach((combinatorControlBehaviour) => {
		const assemblingMachines = findAssemblingMachinesNear(combinatorControlBehaviour.entity)
		if (assemblingMachines.length != 1) {
			// TODO: maybe I can set some kind of indicator for when crafting combinator is near multiple assemblers.
			// or... maybe it's not a problem if a crafting combinator is sandwiched between 2 machines. It should probably
			// just set the recipe for both. Might be convenient for having pairs of assembling machines
			return
		}

		const assemblingMachine = assemblingMachines[0]

		const itemToCraft = combinatorControlBehaviour.parameters.output_signal?.name
		if (!itemToCraft) return

		const recipe = combinatorControlBehaviour.entity.force.recipes[itemToCraft]
		if (!recipe) return

		// TODO: I should make sure the assembling machine is able to produce this kind of item
		assemblingMachine.set_recipe(recipe)
	})
})

function findAllCombinators(): LuaArithmeticCombinatorControlBehavior[] {
	// TODO: it might be more performant to keep track of all built combinators? but then I'll also have to chec when they're created + destroyed
	// TODO: search all surfaces
	const surface = game.surfaces[1]
	return surface.find_entities_filtered({name: CRAFTING_COMBINATOR})
		.map((entity) => entity.get_or_create_control_behavior() as LuaArithmeticCombinatorControlBehavior)
}

function findAssemblingMachinesNear(combinator: LuaEntity): LuaEntity[] {
	return combinator.surface.find_entities_filtered({
		position: combinator.position,
		// TODO: how can I set this to the width of the assembling machine? It might not always be 3.
		radius: 3,
		type: "assembling-machine"
	})
}
