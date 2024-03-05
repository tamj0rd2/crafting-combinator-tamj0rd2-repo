import {ArmorPrototype, RecipePrototype} from "factorio:prototype"
import {table} from "util"

const fireArmor: ArmorPrototype = table.deepcopy(data.raw["armor"]["heavy-armor"])!

fireArmor.name = "fire-armor"
fireArmor.icons = [
	{
		icon: fireArmor.icon!,
		icon_size: fireArmor.icon_size,
		tint: {r: 1, g: 0, b: 0, a: 0.3}
	}
]
fireArmor.resistances = [
	{
		type: "physical",
		decrease: 6,
		percent: 10
	},
	{
		type: "explosion",
		decrease: 10,
		percent: 30
	},
	{
		type: "acid",
		decrease: 5,
		percent: 30
	},
	{
		type: "fire",
		decrease: 0,
		percent: 100
	}
]

const recipe: RecipePrototype = {
	type: "recipe",
	name: "fire-armor",
	enabled: true,
	energy_required: 8, // time to craft in seconds (at crafting speed 1)
	ingredients: [["copper-plate", 200], ["steel-plate", 50]],
	result: "fire-armor"
}

data.extend([fireArmor, recipe])
