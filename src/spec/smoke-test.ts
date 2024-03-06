import {CRAFTING_COMBINATOR} from "../constants"
import {MapPosition} from "factorio:prototype"

test("hello world", function () {
	const nauvis = game.surfaces[1]
	const origin: MapPosition = {x: 0, y: 0}

	const craftingCombinator = assert(nauvis.create_entity({
		name: CRAFTING_COMBINATOR,
		position: origin,
	}))

	assert.truthy(craftingCombinator.valid)
})
