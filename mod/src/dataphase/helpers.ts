/* eslint-disable @typescript-eslint/no-explicit-any */
import * as util from "util"
import {type EntityPrototype, type ItemPrototype, type PrototypeBase, type RecipePrototype} from "factorio:prototype"

interface PrototypeModifications<P extends PrototypeBase> {
	overrideProperties?: Partial<Omit<P, "name" | "type">>
	deleteProperties?: Array<keyof P>
}

export function copyPrototype<P extends PrototypeBase>(
	prototype: P | undefined,
	newName: string,
	modifications: PrototypeModifications<P> = {},
): P {
	if (prototype === undefined) throw new Error("Cannot copy undefined prototype")

	const copied = util.table.deepcopy(prototype)!

	if (modifications.deleteProperties !== undefined) {
		for (const field of modifications.deleteProperties) {
			delete copied[field]
		}
	}

	const asEntity = copied as EntityPrototype
	if (asEntity.minable?.result !== undefined) asEntity.minable.result = newName

	const asItem = copied as unknown as ItemPrototype
	if (asItem.place_result !== undefined) asItem.place_result = newName

	const asRecipe = copied as RecipePrototype
	if (asRecipe.result !== undefined) asRecipe.result = newName
	if (asRecipe.results !== undefined) {
		for (const result of asRecipe.results) {
			if ((result as any).name === prototype.name) {
				(result as any).name = newName
			}
		}
	}

	return {...copied, ...(modifications.overrideProperties ?? {}), name: newName}
}
