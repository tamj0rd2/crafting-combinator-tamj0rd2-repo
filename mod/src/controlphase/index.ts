import * as entities from "./entities"
import constants from "../constants"

const customTypes = [
	entities.CraftingCombinators,
	entities.CraftingCombinator,
	entities.CraftingCombinatorOutput,
]

customTypes.forEach((customType) => {
	script.register_metatable(customType.name, customType)
})

script.on_init(() => {
	customTypes.forEach((customType) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const typeWithoutSafety = customType as any
		(typeWithoutSafety.init !== undefined) && typeWithoutSafety.init()
	})
})

script.on_event(defines.events.script_raised_built, (event) => {
	switch (event.entity.name) {
	case constants.CRAFTING_COMBINATOR:
		return entities.CraftingCombinators.registerExistingEntity(event.entity)
	}
}, [{filter: "name", name: constants.CRAFTING_COMBINATOR}])

script.on_nth_tick(10, () => {
	entities.CraftingCombinators.updateAll()
})
