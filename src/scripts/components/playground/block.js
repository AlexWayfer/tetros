export class Block {
	constructor(position, color) {
		this.position = position
		this.color = color

		let element = document.createElement('div')
		element.classList.add('block', this.color)
		element.style.left =
			`calc(
				(var(--block-size) * ${this.position.x}) + (${this.position.x} * var(--block-margin))
			)`
		element.style.top =
			`calc(
				(var(--block-size) * ${this.position.y}) + (${this.position.y} * var(--block-margin))
			)`

		this.element = element
	}
}
