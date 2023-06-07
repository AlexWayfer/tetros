export class Block {
	constructor(position) {
		this.position = position

		let element = document.createElement('div')
		element.classList.add('block')

		element.style.setProperty('--position-x', this.position.x)
		element.style.setProperty('--position-y', this.position.y)

		this.element = element
	}
}
