import { Point } from './playground/point'
import Figures from './playground/figures/index'

export class Playground {
	static #width = 10 // in blocks
	static #height = 20 // in blocks
	static #speed = 2 // in seconds

	#startOverlay = null
	#resumeOverlay = null
	#pauseButton = null
	#startedAt = null
	#intervalTime = null
	#interval = null
	#timeForResume = null
	#resumeTimeout = null

	constructor(element) {
		this.element = element

		this.element.style.setProperty('--blocks-width', this.constructor.#width)
		this.element.style.setProperty('--blocks-height', this.constructor.#height)

		this.blocks = []

		this.#startOverlay = this.element.querySelector('article.overlay.start')

		this.#startOverlay.querySelector('button').addEventListener('click', () => {
			this.start()
		})

		this.#pauseButton = this.element.querySelector('button.pause')
		this.#pauseButton.addEventListener('click', () => {
			this.pause()
		})

		this.#resumeOverlay = this.element.querySelector('article.overlay.resume')

		this.#resumeOverlay.querySelector('button').addEventListener('click', () => {
			this.resume()
		})
	}

	start() {
		this.#startOverlay.classList.add('hidden')
		this.#pauseButton.classList.remove('hidden')

		// TODO: Recalc both at speed change
		this.#intervalTime = 1000 / this.constructor.#speed
		this.#startedAt = performance.now()

		// console.debug('!start', 'this.#intervalTime = ', this.#intervalTime)
		// console.debug('!start', 'this.#startedAt = ', this.#startedAt)

		this.#initializeInterval()
	}

	pause() {
		if (this.#timeForResume || !this.#startedAt) return null

		this.#timeForResume = (performance.now() - this.#startedAt) % this.#intervalTime

		// console.debug('!pause', 'this.#timeForResume = ', this.#timeForResume)

		clearTimeout(this.#resumeTimeout)
		clearInterval(this.#interval)

		this.#resumeOverlay.classList.remove('hidden')
		this.#pauseButton.classList.add('hidden')
	}

	resume() {
		this.#startedAt = performance.now()

		// console.debug('!resume', 'this.#startedAt = ', this.#startedAt)
		// console.debug('!resume', 'this.#timeForResume = ', this.#timeForResume)

		this.#resumeOverlay.classList.add('hidden')
		this.#pauseButton.classList.remove('hidden')

		this.#resumeTimeout = setTimeout(() => {
			// It's for a check of pause in a pause
			this.#timeForResume = null

			// console.debug('!resume', 'this.#timeForResume = ', this.#timeForResume)

			this.#tick()

			this.#initializeInterval()
		}, this.#timeForResume)
	}

	#initializeInterval()	{
		this.#interval = setInterval(() => {
			this.#tick()
		}, this.#intervalTime)
	}

	#tick() {
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
				if (figure.position.y + figure.constructor.shape.length >= this.constructor.#height)
					return false

				restBlocksPositions = this.blocks.map(block => block.position)

				return !figure.blocks.some(block => {
					return restBlocksPositions.some(restBlockPosition => {
						return restBlockPosition.equals(
							block.position.add(figure.position).add(new Point(0, 1))
						)
					})
				})

			case 'up':
				return false

			// TODO: add moving left/right
			default:
				throw new Error('Unknown direction for figure')
		}
	}
}
