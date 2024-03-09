interface AsyncStep {
	act: () => void
	assert: () => void
}

// runs the steps in sequence
export function perform(steps: AsyncStep[]): void {
	function fnForStep(stepIndex: number): () => void {
		if (stepIndex >= steps.length) {
			return () => null
		}

		const { act, assert } = steps[stepIndex]

		return () => {
			act()
			after_ticks(60, () => {
				assert()
				fnForStep(stepIndex + 1)()
			})
		}
	}
	return fnForStep(0)()
}
