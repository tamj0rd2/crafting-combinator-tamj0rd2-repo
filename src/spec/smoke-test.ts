import {CRAFTING_COMBINATOR} from "../constants"
import {LuaConstantCombinatorControlBehavior, LuaSurface, SignalID, SurfaceCreateEntity} from "factorio:runtime"
import {async} from "./async"

describe("basic crafting combinator functionality", () => {
	const nauvis = () => game.surfaces[1]
	const player = () => game.players[1]
	const force = () => game.forces.player
	const entitiesForTesting = ["assembling-machine-1", CRAFTING_COMBINATOR, "constant-combinator"]

	before_all(() => {
		nauvis().always_day = true
		player().cheat_mode = true
		player().force.research_all_technologies()
	})

	before_each(() => {
		nauvis().find_entities().forEach(entity => {
			if (entitiesForTesting.includes(entity.name)) {
				entity.destroy({raise_destroy: true})
			}
		})
	})

	test("can set the recipe of an assembling machine using a crafting combinator with an incoming signal", () => {
		const {
			setConstantCombinatorSignal,
			assertAssemblingMachineRecipe,
		} = setupTestingArea()

		setConstantCombinatorSignal({type: "item", name: "pipe"})
		async(() => assertAssemblingMachineRecipe("pipe"))
			.thenImmediately(() => setConstantCombinatorSignal({type: "item", name: "iron-stick"}))
			.thenEventually(() => assertAssemblingMachineRecipe("iron-stick"))
			.run()
	})

	function setupTestingArea() {
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

		const constantCombinator = createEntity(nauvis(), {
			name: "constant-combinator",
			position: {x: craftingCombinator.position.x + 0, y: craftingCombinator.position.y + 1},
			force: force()
		})

		constantCombinator.connect_neighbour({
			wire: defines.wire_type.red,
			target_entity: craftingCombinator,
			target_circuit_id: defines.circuit_connector_id.combinator_input
		})

		const constantCombinatorCb = constantCombinator.get_or_create_control_behavior() as LuaConstantCombinatorControlBehavior
		return {
			craftingCombinator,
			setConstantCombinatorSignal: (signal: SignalID) => constantCombinatorCb.parameters = [{count: 1, index: 1, signal: signal}],
			assertAssemblingMachineRecipe: (expectedRecipe: string) => assert.equal(expectedRecipe, assemblingMachine.get_recipe()?.name)
		}
	}

	function createEntity(surface: LuaSurface, params: SurfaceCreateEntity) {
		if (params.name ! in entitiesForTesting) {
			throw Error(`Add ${params.name} to entitiesForTesting to allow creating/deleting it in tests.`)
		}

		const entity = assert(surface.create_entity(params))
		assert.truthy(entity.valid)
		return entity
	}
})
