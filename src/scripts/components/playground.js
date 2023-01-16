import { Point } from './playground/point'
import Figures from './playground/figures/index'

export class Playground {
	static #speed = 2 // in seconds

	constructor(element) {
		this.element = element

		this.blocksWidth = getComputedStyle(this.element).getPropertyValue('--blocks-width')
		this.blocksHeight = getComputedStyle(this.element).getPropertyValue('--blocks-height')

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
				if (this.#canMove('down')) {
					this.currentFigure.moveDown()
				} else {
					this.currentFigure.destruct()

					this.#constructFigure()
				}
			} else {
				this.#constructFigure()
			}
		}, 1000 / this.constructor.#speed)
	}

	#constructFigure() {
		const figureClass = Figures.sample()

		this.currentFigure = new figureClass(
			new Point(
				(this.blocksWidth / 2 - Math.ceil(figureClass.shape[0].length / 2)),
				0
			)
		)

		this.element.appendChild(this.currentFigure.element)
	}

	#canMove(direction, figure = this.currentFigure) {
		switch(direction) {
			case 'down':
				return figure.position.y + figure.constructor.shape.length <= this.blocksHeight
			case 'up':
				return false
			default:
				throw new Error('Unknown direction for figure')
		}
	}
}
