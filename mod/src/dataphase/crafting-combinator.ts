import constants from "../constants"
import {type RecipePrototype} from "factorio:prototype"
import * as helpers from "./helpers"

const craftingCombinator = helpers.copyPrototype(
	data.raw["decider-combinator"]["decider-combinator"],
	constants.CRAFTING_COMBINATOR,
)

const craftingCombinatorItem = helpers.copyPrototype(
	data.raw["item"]["decider-combinator"],
	constants.CRAFTING_COMBINATOR,
	{
		overrideProperties: {
			place_result: constants.CRAFTING_COMBINATOR,
		}
	}
)

const craftingCombinatorRecipe: RecipePrototype = {
	type: "recipe",
	name: constants.CRAFTING_COMBINATOR,
	enabled: true,
	energy_required: 1,
	ingredients: [["copper-cable", 10], ["electronic-circuit", 10]],
	result: constants.CRAFTING_COMBINATOR,
}

const craftingCombinatorOutput = helpers.copyPrototype(
	data.raw["constant-combinator"]["constant-combinator"],
	constants.CRAFTING_COMBINATOR_OUTPUT,
	{
		deleteProperties: ["collision_box", "minable"],
		overrideProperties: {
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
			selectable_in_game: false,
			draw_circuit_wires: false,
		},
	}
)

data.extend([
	craftingCombinator,
	craftingCombinatorOutput,
	craftingCombinatorItem,
	craftingCombinatorRecipe
])
