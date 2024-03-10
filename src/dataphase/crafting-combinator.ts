import {table} from "util"
import {CRAFTING_COMBINATOR, CRAFTING_COMBINATOR_OUTPUT} from "../constants"
import {ConstantCombinatorPrototype, ItemPrototype} from "factorio:prototype"

const craftingCombinator = {
	...table.deepcopy(data.raw["decider-combinator"]["decider-combinator"])!,
	name: CRAFTING_COMBINATOR,
}

const craftingCombinatorItem: ItemPrototype = {
	...table.deepcopy(data.raw.item["decider-combinator"])!,
	name: CRAFTING_COMBINATOR
}

const craftingCombinatorOutput: ConstantCombinatorPrototype = {
	...table.deepcopy(data.raw["constant-combinator"]["constant-combinator"])!,
	name: CRAFTING_COMBINATOR_OUTPUT,
	flags: [
		"placeable-off-grid",
		"hidden",
		"hide-alt-info",
		"not-on-map",
		"not-upgradable",
		"not-deconstructable",
		"not-blueprintable",
	],
	collision_mask: [],
	collision_box: undefined,
	minable: undefined,
	selectable_in_game: false,
	draw_circuit_wires: false,
}

data.extend([craftingCombinator, craftingCombinatorOutput, craftingCombinatorItem])
