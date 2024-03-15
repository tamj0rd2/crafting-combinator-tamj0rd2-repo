import {CRAFTING_COMBINATOR} from "../constants"
import {
	LuaConstantCombinatorControlBehavior,
	LuaEntity,
	LuaSurface,
	SignalID,
	SurfaceCreateEntity
} from "factorio:runtime"
import {perform} from "./async"
import {CraftingCombinators} from "../controlphase/entities/crafting-combinator"

describe("basic crafting combinator functionality", () => {
	const nauvis = () => game.surfaces[1]
	const player = () => game.players[1]
	const force = () => game.forces.player
	const entitiesForTesting = [
		"assembling-machine-1",
		CRAFTING_COMBINATOR,
		"constant-combinator",
		"small-electric-pole",
	]

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
			craftingCombinator,
			setConstantCombinatorSignal,
			assertAssemblingMachineRecipe,
			assertElectricPoleSignal,
		} = setupTestingArea()

		perform([
			{
				act: () => setConstantCombinatorSignal({type: "item", name: "pipe"}),
				assert: () => {
					assert.equal("pipe", craftingCombinator.recipe?.name)
					assertAssemblingMachineRecipe("pipe")
					assertElectricPoleSignal("pipe")
				}
			},
			{
				act: () => setConstantCombinatorSignal({type: "item", name: "iron-stick"}),
				assert: () => {
					assert.equal("iron-stick", craftingCombinator.recipe?.name)
					assertAssemblingMachineRecipe("iron-stick")
					assertElectricPoleSignal("iron-stick")
				}
			}
		])
	})

	function setupTestingArea() {
		const assemblingMachine = createEntity(nauvis(), {
			name: "assembling-machine-1",
			position: {x: 0, y: 0},
			force: force(),
			raise_built: true,
		})

		const craftingCombinator = CraftingCombinators.create(nauvis(), {
			position: translatePositionOf(assemblingMachine, 2, -1),
			force: force(),
		})

		const smallElectricPole = createEntity(nauvis(), {
			name: "small-electric-pole",
			position: translatePositionOf(craftingCombinator.entity, 0, -2),
			force: force(),
			raise_built: true,
		})
		smallElectricPole.connect_neighbour({
			wire: defines.wire_type.green,
			target_entity: craftingCombinator.entity,
			target_circuit_id: defines.circuit_connector_id.combinator_output
		})

		const constantCombinator = createEntity(nauvis(), {
			name: "constant-combinator",
			position: translatePositionOf(craftingCombinator.entity, 0, 1),
			force: force(),
			raise_built: true,
		})

		constantCombinator.connect_neighbour({
			wire: defines.wire_type.red,
			target_entity: craftingCombinator.entity,
			target_circuit_id: defines.circuit_connector_id.combinator_input
		})

		const constantCombinatorCb = constantCombinator.get_or_create_control_behavior() as LuaConstantCombinatorControlBehavior
		return {
			craftingCombinator,
			// TODO: this makes me want to build my own abstraction on top of these entities
			setConstantCombinatorSignal: (signal: SignalID) => constantCombinatorCb.parameters = [{
				count: 1,
				index: 1,
				signal: signal
			}],
			assertAssemblingMachineRecipe: (expectedRecipe: string) => assert.equal(expectedRecipe, assemblingMachine.get_recipe()?.name),
			assertElectricPoleSignal: (expectedSignalName: string) => {
				const circuitNetwork = assert(smallElectricPole.get_circuit_network(defines.wire_type.green))
				assert.equal(expectedSignalName, circuitNetwork.signals?.[0]?.signal?.name)
			}
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

function translatePositionOf(entity: LuaEntity, x: number, y: number) {
	return {x: entity.position.x + x, y: entity.position.y + y}
}
