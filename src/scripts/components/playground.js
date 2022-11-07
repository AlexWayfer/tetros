import { Point } from './playground/point'
import Figures from './playground/figures/index'

export class Playground {
	constructor(element) {
		this.element = element

		this.blocksWidth = getComputedStyle(this.element).getPropertyValue('--blocks-width')

		this.startOverlay = this.element.querySelector('article.start')

		this.startOverlay.querySelector('button').addEventListener('click', () => {
			this.start()
		})
	}

	start() {
		this.startOverlay.classList.add('hidden')

		setInterval(() => {
			console.debug('Hello, world!')

			if (this.currentFigure) {
				this.currentFigure.moveDown()
			} else {
				const figureClass = Figures.sample()

				console.debug((this.blocksWidth / 2 - Math.ceil(figureClass.shape[0].length / 2)))

				this.currentFigure = new figureClass(
					new Point(
						(this.blocksWidth / 2 - Math.ceil(figureClass.shape[0].length / 2)),
						0
					)
				)

				this.element.appendChild(this.currentFigure.element)
			}
		}, 1000)
	}
}
