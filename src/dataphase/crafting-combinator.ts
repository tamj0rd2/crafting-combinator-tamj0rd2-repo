import {table} from "util"
import {CRAFTING_COMBINATOR} from "../constants"

const craftingCombinator = table.deepcopy(data.raw["decider-combinator"]["decider-combinator"])!
craftingCombinator.name = CRAFTING_COMBINATOR
craftingCombinator.energy_source = {type: "void"}

const item = table.deepcopy(data.raw.item["decider-combinator"])!
item.name = CRAFTING_COMBINATOR

data.extend([craftingCombinator, item])
