import {type BoundingBoxWrite, type ForceIdentification, type LuaEntity} from "factorio:runtime"
import {type MapPosition} from "factorio:prototype"

function translatePositionOfEntity(entity: LuaEntity, x: number, y: number) {
	return translatePosition(entity.position, x, y)
}

function translatePosition(position: MapPosition, x: number, y: number): MapPosition {
	if (Array.isArray(position)) {
		return [position[0] + x, position[1] + y]
	}

	const coords = position as {x: number, y: number}
	return {x: coords.x + x, y: coords.y + y}
}

function resizeBoundingBox(boundingBox: BoundingBoxWrite, amount: number): BoundingBoxWrite {
	return {
		left_top: translatePosition(boundingBox.left_top, -amount, -amount),
		right_bottom: translatePosition(boundingBox.right_bottom, amount, amount),
	}
}

export interface FindAdjacentEntitiesParams {
	readonly name?: string | readonly string[]
	readonly type?: string | readonly string[]
	readonly ghost_name?: string | readonly string[]
	readonly ghost_type?: string | readonly string[]
	readonly force?: ForceIdentification | readonly ForceIdentification[]
}

function findEntitiesAdjacentTo(entity: LuaEntity, params: FindAdjacentEntitiesParams) {
	return entity.surface.find_entities_filtered({
		...params,
		area: resizeBoundingBox(entity.bounding_box, 1),
	})
}

export default {
	translatePositionOfEntity,
	translatePosition,
	resizeBoundingBox,
	findEntitiesAdjacentTo
}
