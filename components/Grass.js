'use strict'
const Component = require('./Component.js'), {genDirs, chooseCells, removeElement} = require('./functions.js')

module.exports = class extends Component {
	constructor (x, y) {
		super(x, y)
		this.time = 0
		this.directions = genDirs(x, y)
	}

	action () {
		this.time++
		const cells = chooseCells(0, this.directions)
		const randomCell = cells[Math.floor(Math.random() * cells.length)]
		if (this.time >= 7 && randomCell) {
			field[randomCell[1]][randomCell[0]] = 1
			grasses.push(new Grass(randomCell[0], randomCell[1]))
			this.time = 0
		}
	}
}