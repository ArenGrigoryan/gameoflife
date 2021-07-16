'use strict'
const Component = require('./Component.js'), {genDirs, chooseCells, removeElement} = require('./functions.js')

module.exports = class Human extends Component {
	constructor (x, y) {
		super(x, y)
		this.energy = 10
		this.time = 0
	}

	action () {
		if (this.energy <= 0) {
			field[this.y][this.x] = 0
			removeElement(this.x, this.y, 3)
		}
		else {
			this.directions = genDirs(this.x, this.y)
			const wolvesNearby = chooseCells(3, this.directions)
			if (wolvesNearby && wolvesNearby.length > 0) {
				const coords = wolvesNearby[Math.floor(Math.random()*wolvesNearby.length)]
				removeElement(coords[0], coords[1], 3)
				field[coords[1]][coords[0]] = 5
				field[this.y][this.x] = 0
				this.x = coords[0]
				this.y = coords[1]
				this.energy+=3
			}
			else {
				const cowsNearby = chooseCells(2, this.directions)
				if (cowsNearby && cowsNearby.length > 0) {
					const coords = cowsNearby[Math.floor(Math.random()*cowsNearby.length)]
					removeElement(coords[0], coords[1], 2)
					field[coords[1]][coords[0]] = 5
					field[this.y][this.x] = 0
					this.x = coords[0]
					this.y = coords[1]
					this.energy+=2
				}
				else {
					const grassesNearby = chooseCells(1, this.directions)
					if (grassesNearby && grassesNearby.length > 0) {
						const coords = grassesNearby[Math.floor(Math.random()*grassesNearby.length)]
						for (let i in grasses) if (grasses[i].x == coords[0] && grasses[i].y == coords[1]) { grasses[i].x = this.x ; grasses[i].y = this.y ; grasses[i].directions = genDirs(grasses[i].x, grasses[i].y) }
						field[coords[1]][coords[0]] = 5
						field[this.y][this.x] = 1
						this.x = coords[0]
						this.y = coords[1]
					}
					else {
						const emptiesNearby = chooseCells(0, this.directions)
						if (emptiesNearby.length > 0) {
							const coords = emptiesNearby[Math.floor(Math.random()*emptiesNearby.length)]
							field[coords[1]][coords[0]] = 5
							field[this.y][this.x] = 0
							this.x = coords[0]
							this.y = coords[1]
						}
					}
					this.energy = this.energy - (dark ? 0.5 : 1)
				}
			}
		}
	}
}