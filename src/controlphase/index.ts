import {CraftingCombinator, CraftingCombinators} from "./entities/crafting-combinator"
import {CRAFTING_COMBINATOR} from "../constants"

const customTypes = [CraftingCombinators, CraftingCombinator]
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
	case CRAFTING_COMBINATOR:
		return CraftingCombinators.registerExistingEntity(event.entity)
	}
}, [{filter: "name", name: CRAFTING_COMBINATOR}])

script.on_nth_tick(10, () => {
	CraftingCombinators.updateAll()
})
