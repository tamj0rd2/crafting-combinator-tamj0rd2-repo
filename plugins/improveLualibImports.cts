import ts from "typescript"
import * as tstl from "typescript-to-lua"


const myCustomPlugin: tstl.Plugin = {
	beforeEmit(
		program: ts.Program,
		options: tstl.CompilerOptions,
		emitHost: tstl.EmitHost,
		result: tstl.EmitFile[]
	) {
		for (const file of result) {
			if (file.outputPath.includes("lualib_bundle")) continue

			const updatedCode = file.code.split("\n")
				.filter((line) => !line.startsWith("local __TS__"))
				.map((line) => line.replace(/__TS__/, "____lualib.__TS__"))
				.join("\n")

			file.code = updatedCode
		}
	},
}

// noinspection JSUnusedGlobalSymbols
export default myCustomPlugin
