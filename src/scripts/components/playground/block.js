export class Block {
	#position

	constructor(position, color) {
		const element = document.createElement('div')

		element.classList.add('block')

		element.style.setProperty('--background-color', color)

		this.element = element

		this.position = position
	}

	get position() {
		return this.#position
	}

	set position(newValue) {
		this.#position = newValue

		this.element.style.setProperty('--position-x', newValue.x)
		this.element.style.setProperty('--position-y', newValue.y)
	}
}
