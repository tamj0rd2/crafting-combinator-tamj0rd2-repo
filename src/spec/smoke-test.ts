import {CRAFTING_COMBINATOR} from "../constants"
import {LuaArithmeticCombinatorControlBehavior, LuaEntity, LuaSurface, SurfaceCreateEntity} from "factorio:runtime"


describe("basic crafting combinator functionality", () => {
	const createdEntities: LuaEntity[] = []
	const nauvis = () => game.surfaces[1]
	const player = () => game.players[1]
	const force = () => game.forces.player

	before_all(() => {
		nauvis().always_day = true
		player().cheat_mode = true
		player().force.research_all_technologies()
	})

	after_each(() => {
		createdEntities.forEach(entity => {
			assert(entity.destroy({raise_destroy: true}))
		})
		createdEntities.length = 0
	})

	test("can set the recipe of an assembling machine using the crafting combinator", () => {
		const { assemblingMachine, craftingCombinator } = setupTestEntities()

		const combinatorControlBehaviour = craftingCombinator.get_or_create_control_behavior() as LuaArithmeticCombinatorControlBehavior
		combinatorControlBehaviour.parameters = {
			...combinatorControlBehaviour.parameters,
			output_signal: {type: "item", name: "pipe"},
		}

		after_ticks(60, () => {
			// this is brittle, but it gives better test output than async + on_tick
			assert.equal("pipe", assemblingMachine.get_recipe()?.name)
		})
	})

	function setupTestEntities() {
		const assemblingMachine = createEntity(nauvis(), {
			name: "assembling-machine-1",
			position: {x: 0, y: 0},
			force: force()
		})

		const craftingCombinator = createEntity(nauvis(), {
			name: CRAFTING_COMBINATOR,
			position: {x: assemblingMachine.position.x + 2, y: assemblingMachine.position.y - 1},
			force: force()
		})

		return {
			assemblingMachine,
			craftingCombinator,
		}
	}

	function createEntity(surface: LuaSurface, params: SurfaceCreateEntity) {
		const entity = assert(surface.create_entity(params))
		assert.truthy(entity.valid)
		createdEntities.push(entity)
		return entity
	}
})
