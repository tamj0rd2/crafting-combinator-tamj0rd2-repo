interface Async {
	thenImmediately: (fn: () => void) => Async
	thenEventually: (fn: () => void) => Async
	run: () => void
}

function async(fn: () => void = () => null): Async {
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

interface AsyncStep {
	action: () => void
	assert?: () => void
}

// runs the steps in sequence
export function perform(steps: AsyncStep[]): void {
	steps.reduce((queue, {action, assert}) => {
		if (!assert) return queue.thenImmediately(action)
		return queue.thenImmediately(action).thenEventually(assert)
	}, async()).run()
}
