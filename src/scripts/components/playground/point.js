export class Point {
	constructor(x, y) {
		this.x = x
		this.y = y
	}

	add(anotherPoint) {
		return new this.constructor(this.x + anotherPoint.x, this.y + anotherPoint.y)
	}
}
