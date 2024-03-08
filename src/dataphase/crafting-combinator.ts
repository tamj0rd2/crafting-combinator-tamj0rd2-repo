import {table} from "util"
import {CRAFTING_COMBINATOR} from "../constants"

const craftingCombinator = table.deepcopy(data.raw["arithmetic-combinator"]["arithmetic-combinator"])!
craftingCombinator.name = CRAFTING_COMBINATOR
craftingCombinator.energy_source = {type: "void"}

const item = table.deepcopy(data.raw.item["arithmetic-combinator"])!
item.name = CRAFTING_COMBINATOR

data.extend([craftingCombinator, item])
