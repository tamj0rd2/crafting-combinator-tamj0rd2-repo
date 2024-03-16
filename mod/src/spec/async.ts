interface AsyncStep {
	act: () => void
	tickDelayBeforeAssert?: number
	assert: () => void
}

// runs the steps in sequence
export function perform(steps: AsyncStep[]): void {
	function fnForStep(stepIndex: number): () => void {
		if (stepIndex >= steps.length) {
			return () => undefined
		}

		const { act, assert, tickDelayBeforeAssert } = steps[stepIndex]

		return () => {
			act()
			after_ticks(tickDelayBeforeAssert ?? 60, () => {
				assert()
				fnForStep(stepIndex + 1)()
			})
		}
	}
	return fnForStep(0)()
}
