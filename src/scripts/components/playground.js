import { Point } from './playground/point'
import Figures from './playground/figures/index'

export class Playground {
	static #width = 10 // in blocks
	static #height = 20 // in blocks
	static #speed = 2 // in seconds

	constructor(element) {
		this.element = element

		this.element.style.setProperty('--blocks-width', this.constructor.#width)
		this.element.style.setProperty('--blocks-height', this.constructor.#height)

		this.blocks = []

		this.startOverlay = this.element.querySelector('article.start')

		this.startOverlay.querySelector('button').addEventListener('click', () => {
			this.start()
		})
	}

	start() {
		this.startOverlay.classList.add('hidden')

		setInterval(() => {
			// console.debug('Hello, world!')

			if (this.currentFigure) {
				if (this.#canMoveFigure('down')) {
					this.currentFigure.moveDown()
				} else {
					this.#destructFigure()

					this.#constructFigure()
				}
			} else {
				this.#constructFigure()
			}
		}, 1000 / this.constructor.#speed)
	}

	#constructFigure(figureClass = Figures.sample()) {
		this.currentFigure = new figureClass(
			new Point(
				(this.constructor.#width / 2 - Math.ceil(figureClass.shape[0].length / 2)),
				0
			)
		)

		this.element.appendChild(this.currentFigure.element)
	}

	#destructFigure(figure = this.currentFigure) {
		const newBlocks = figure.blocks

		newBlocks.forEach(block => {
			block.element.remove()

			block.position = figure.position.add(block.position)

			this.element.appendChild(block.element)
		})

		this.blocks.push(...newBlocks)

		this.currentFigure.element.remove()
		delete this.currentFigure
	}

	#canMoveFigure(direction, figure = this.currentFigure) {
		switch(direction) {
			case 'down':
				// TODO: check for blocks below
				if (figure.position.y + figure.constructor.shape.length >= this.constructor.#height)
					return false

				return true

			case 'up':
				return false

			// TODO: add moving left/right
			default:
				throw new Error('Unknown direction for figure')
		}
	}
}
