export class Playground {
	private current_figure?: Element

	constructor(public readonly element: Element) {
	}

	start() {
		setInterval(() => {
			console.debug('Hello, world!')

			if (this.current_figure) {
				// this.current_figure
			}
		}, 1000)
	}
}
