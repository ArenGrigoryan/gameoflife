'use strict'
const Component = require('./Component.js'), {genDirs, chooseCells, removeElement} = require('./functions.js')

module.exports = class extends Component {
	constructor (x, y) {
		super(x, y)
		setTimeout(() => {
			genDirs(x,y).concat([[this.x-2, this.y], [this.x+2, this.y], [this.x, this.y-2], [this.x, this.y+2]])
				.filter(dir => (dir[0] >= 0 && dir[0] < field[0].length && dir[1] >= 0 && dir[1] < field.length))
				.forEach(coords => {
					const id = field[coords[1]][coords[0]]
					if (id != 0) {
						removeElement(coords[0], coords[1], id)
						field[coords[1]][coords[0]] = 0
					}
				})
			removeElement(x,y,4)
			field[y][x] = 0
		}, (daytimeChangeRate+daytimeChangeRate/4)*Math.random())
	}
}