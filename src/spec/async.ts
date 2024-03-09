interface Async {
	thenImmediately: (fn: () => void) => Async
	thenEventually: (fn: () => void) => Async
	run: () => void
}

export function async(fn: () => void): Async {
	const oneSecond = 60

	return {
		thenImmediately: function (nextFn: () => void): Async {
			return async(() => {
				fn()
				nextFn()
			})
		},
		thenEventually: function (nextFn: () => void): Async {
			return async(() => {
				after_ticks(oneSecond, function () {
					fn()
					after_ticks(oneSecond, nextFn)
				})
			})
		},
		run: () => {
			after_ticks(oneSecond, function () {
				fn()
			})
		},
	}
}
