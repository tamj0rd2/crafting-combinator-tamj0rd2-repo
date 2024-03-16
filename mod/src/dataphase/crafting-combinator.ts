import * as util from "util"
import constants from "../constants"
import {type ConstantCombinatorPrototype, type ItemPrototype} from "factorio:prototype"

const craftingCombinator = {
	...util.table.deepcopy(data.raw["decider-combinator"]["decider-combinator"])!,
	name: constants.CRAFTING_COMBINATOR,
}

const craftingCombinatorItem: ItemPrototype = {
	...util.table.deepcopy(data.raw.item["decider-combinator"])!,
	name: constants.CRAFTING_COMBINATOR
}

const craftingCombinatorOutput: ConstantCombinatorPrototype = {
	...util.table.deepcopy(data.raw["constant-combinator"]["constant-combinator"])!,
	name: constants.CRAFTING_COMBINATOR_OUTPUT,
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
