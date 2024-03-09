import init = require("__factorio-test__/init");

if (!!script.active_mods["factorio-test"] && !!script.active_mods["EditorExtensions"]) {
	init(["smoke-test"], {
		default_timeout: 60 * 5,
	})
}
