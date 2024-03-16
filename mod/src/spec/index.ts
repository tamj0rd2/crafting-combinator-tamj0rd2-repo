import init = require("__factorio-test__/init");

if (script.active_mods["factorio-test"] !== undefined && script.active_mods["EditorExtensions"] !== undefined) {
	init(["smoke-test"], {
		default_timeout: 60 * 10,
	})
}
