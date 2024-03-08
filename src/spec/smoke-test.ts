import {CRAFTING_COMBINATOR} from "../constants"
import {MapPosition} from "factorio:prototype"
import {LuaArithmeticCombinatorControlBehavior} from "factorio:runtime"

test("can set the recipe of an assembling machine using the crafting combinator", function () {
	const player = game.players[1]
	player.cheat_mode = true
	player.force.research_all_technologies()

	const nauvis = game.surfaces[1]
	nauvis.always_day = true

	const force = game.forces.player
	const origin: MapPosition = {x: 0, y: 0}

	const assemblingMachine = assert(nauvis.create_entity({
		name: "assembling-machine-1",
		position: origin,
		force: force
	}))

	const craftingCombinator = assert(nauvis.create_entity({
		name: CRAFTING_COMBINATOR,
		position: {x: assemblingMachine.position.x + 2, y: assemblingMachine.position.y - 1},
		force: force
	}))
	assert.truthy(craftingCombinator.valid)

	const cb = craftingCombinator.get_or_create_control_behavior() as LuaArithmeticCombinatorControlBehavior
	cb.parameters = {
		...cb.parameters,
		output_signal: {type: "item", name: "pipe"},
	}

	after_ticks(60, () => {
		// this is brittle, but it gives better test output than async + on_tick
		assert.equal("pipe", assemblingMachine.get_recipe()?.name)
	})

	// const constantCombinator = assert(nauvis.create_entity({
	// 	name: "constant-combinator",
	// 	position: {x: assemblingMachine.position.x + 2, y: assemblingMachine.position.y + 1},
	// 	force: force
	// }))
})
