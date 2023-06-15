import { Point } from './playground/point'
import Figures from './playground/figures/index'

export class Playground {
	static #width = 10 // in blocks
	static #height = 20 // in blocks
	static #accelerationCoefficient = 5

	state = null
	#speed = null
	#startOverlay = null
	#resumeOverlay = null
	#stopOverlay = null
	#pauseButton = null
	#intervalCreatedAt = null
	#intervalTime = null
	#interval = null
	#timeoutCreatedAt = null
	#timeoutTime = null
	#timeout = null

	constructor(element) {
		this.element = element

		this.element.style.setProperty('--blocks-width', this.constructor.#width)
		this.element.style.setProperty('--blocks-height', this.constructor.#height)

		this.blocks = []

		this.state = 'initialized'
		this.speed = 2 // ticks in 1 second

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

		this.#stopOverlay = this.element.querySelector('article.overlay.stop')
		this.#stopOverlay.querySelector('button').addEventListener('click', () => {
			this.restart()
		})
	}

	get speed() {
		return this.#speed
	}

	set speed(newValue) {
		const oldValue = this.#speed

		this.#speed = newValue

		this.#intervalTime = 1000 / this.#speed

		if (this.state == 'running' || this.state == 'accelerated') {
			this.#calculateTimeoutTime(oldValue < newValue)
			clearTimeout(this.#timeout)
			clearInterval(this.#interval)
			this.#initializeTimeout()
		}
	}

	start() {
		this.state = 'running'

		this.#startOverlay.classList.add('hidden')
		this.#stopOverlay.classList.add('hidden')
		this.#pauseButton.classList.remove('hidden')

		// Also changed in `speed` setter
		this.#intervalCreatedAt = performance.now()

		// console.debug('!start', 'this.#intervalTime = ', this.#intervalTime)
		// console.debug('!start', 'this.#intervalCreatedAt = ', this.#intervalCreatedAt)

		this.#initializeInterval()
	}

	pause() {
		if (this.state != 'running') return null

		this.state = 'paused'

		this.#calculateTimeoutTime()

		// console.debug('!pause', 'this.#timeoutTime = ', this.#timeoutTime)

		clearTimeout(this.#timeout)
		clearInterval(this.#interval)

		this.#resumeOverlay.classList.remove('hidden')
		this.#pauseButton.classList.add('hidden')
	}

	resume() {
		this.state = 'running'

		// console.debug('!resume', 'this.#intervalCreatedAt = ', this.#intervalCreatedAt)
		// console.debug('!resume', 'this.#timeoutTime = ', this.#timeoutTime)

		this.#resumeOverlay.classList.add('hidden')
		this.#pauseButton.classList.remove('hidden')

		this.#initializeTimeout()
	}

	stop() {
		this.state = 'stopped'

		clearInterval(this.#interval)
		this.#interval = null

		this.#stopOverlay.classList.remove('hidden')
	}

	restart() {
		this.#clear()

		this.start()
	}

	forceDown(figure = this.currentFigure) {
		// console.debug('!forceDown', 'figure = ', figure)

		// TODO: Rewrite to instant movement
		while (this.#canMoveFigure('down', figure)) {
			figure.moveDown()
		}

		this.#destructFigure(figure)
	}

	accelerate() {
		// console.debug('!accelerate')

		if (this.state != 'running') return null

		this.state = 'accelerated'

		this.speed *= this.constructor.#accelerationCoefficient

		// console.debug('!accelerate', 'done')
	}

	stopAcceleration() {
		// console.debug('!stopAcceleration')

		if (this.state != 'accelerated') return null

		this.speed /= this.constructor.#accelerationCoefficient

		this.state = 'running'

		// console.debug('!stopAcceleration', 'done')
	}

	#calculateTimeoutTime(newIsLess = false) {
		this.#timeoutTime = (
			newIsLess ?
				this.#intervalTime :
				(
					performance.now() - (this.#timeoutCreatedAt || this.#intervalCreatedAt)
				) % this.#intervalTime
		)
	}

	#initializeTimeout() {
		this.#timeoutCreatedAt = performance.now()

		this.#timeout = setTimeout(() => {
			this.#timeoutCreatedAt = null

			this.#initializeInterval()
		}, this.#timeoutTime)
	}

	#initializeInterval()	{
		this.#tick()

		this.#intervalCreatedAt = performance.now()

		// console.debug('#initializeInterval, this.#intervalTime = ', this.#intervalTime)

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

	#clear() {
		this.#removeFigure()

		this.blocks.forEach(block => {
			block.element.remove()
		})

		this.blocks = []
	}

	#constructFigure(figureClass = Figures.sample()) {
		// console.debug('figureClass = ', figureClass)
		this.currentFigure = new figureClass(
			new Point(
				(this.constructor.#width / 2 - Math.ceil(figureClass.shape[0].length / 2)),
				0
			)
		)

		const restBlocksPositions = this.blocks.map(block => block.position)

		if (
			this.currentFigure.blocks.some(block => {
				return restBlocksPositions.some(restBlockPosition => {
					return restBlockPosition.equals(
						block.position.add(this.currentFigure.position)
					)
				})
			})
		) {
			this.stop()
			return false
		}

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

		this.#removeFigure(figure)
	}

	#removeFigure(figure = this.currentFigure) {
		figure.element.remove()

		if (figure == this.currentFigure) {
			delete this.currentFigure
		}
	}

	#canMoveFigure(direction, figure = this.currentFigure) {
		switch(direction) {
			case 'down':
				if (figure.position.y + figure.constructor.shape.length >= this.constructor.#height)
					return false

				const restBlocksPositions = this.blocks.map(block => block.position)

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
