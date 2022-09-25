export class Playground {
	private startOverlay = this.element.querySelector('article.start')!
	private currentFigure?: Element

	constructor(public readonly element: Element) {
		this.startOverlay.querySelector('button')!.addEventListener('click', () => {
			this.start()
		})
	}

	start() {
		this.startOverlay.classList.add('hidden')
		setInterval(() => {
			console.debug('Hello, world!')

			if (this.currentFigure) {
				// this.current_figure
			}
		}, 1000)
	}
}
