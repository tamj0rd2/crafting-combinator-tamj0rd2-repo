import init = require("__factorio-test__/init");

if (script.active_mods["factorio-test"]) {
	init(["smoke-test"], {
		default_timeout: 60 * 5,
		log_passed_tests: false,
	})
}
