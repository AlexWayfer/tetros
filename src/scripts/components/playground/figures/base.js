import { Point } from '../point'
import { Block } from '../block'

export class Base {
	constructor(position) {
		this.blocks = []

		this.constructor.shape.forEach((row, rowIndex) => {
			row.forEach((element, elementIndex) => {
				if (!element) return

				this.blocks.push(new Block(new Point(elementIndex, rowIndex), this.constructor.color))
			})
		})

		let element = document.createElement('div')
		element.classList.add('figure', this.constructor.name)
		element.style.width = `calc(var(--block-size) * ${this.constructor.shape[0].length})`
		element.style.height = `calc(var(--block-size) * ${this.constructor.shape.length})`

		this.blocks.forEach(block => {
			element.appendChild(block.element)
		})

		this.element = element

		this.#move(position)
	}

	moveDown() {
		this.#move(new Point(this.position.x, this.position.y + 1))
	}

	#move(newPosition) {
		this.position = newPosition

		this.element.style.left = `calc(var(--block-size) * ${newPosition.x})`
		this.element.style.top = `calc(var(--block-size) * ${newPosition.y})`
	}
}
