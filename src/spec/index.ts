/* eslint-disable @typescript-eslint/no-var-requires */

if (script.active_mods["factorio-test"]) {
	/** @noSelf **/
	const init: (files: string[]) => unknown = require("__factorio-test__.init")
	init(["my-first-test"])
}
