'use strict'

const genDirs = (x, y) => [ [x-1, y-1], [x, y-1], [x+1, y-1], [x-1, y], [x+1, y], [x-1, y+1], [x, y + 1], [x+1, y+1] ]
	, chooseCells = (ch, dirs) => dirs.filter(dir => (dir[0] >= 0 && dir[0] < field[0].length && dir[1] >= 0 && dir[1] < field.length && field[dir[1]][dir[0]] == ch))
	, removeElement = (x,y,id) => {
		let arr = eval([, 'grasses', 'cows', 'wolves', 'bombs'][id])
		if (arr) for (let i in arr) if (arr[i].x == x && arr[i].y == y) arr.splice(i, 1)
	}

class Component { constructor (x, y) { this.x = x ; this.y = y } }

class Grass extends Component {
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

class Cow extends Component {
	constructor (x, y) {
		super(x, y)
		this.energy = 5
	}

	action () {
		if (this.energy == 0) {
			field[this.y][this.x] = 0
			removeElement(this.x, this.y, 2)
		}
		else {
			this.directions = genDirs(this.x, this.y)
			const grassesNearby = chooseCells(1, this.directions)
			if (grassesNearby && grassesNearby.length > 0) {
				const coords = grassesNearby[Math.floor(Math.random()*grassesNearby.length)]
				for (let i in grasses) if (grasses[i].x == coords[0] && grasses[i].y == coords[1]) grasses.splice(i, 1)
				field[coords[1]][coords[0]] = 2
				field[this.y][this.x] = 0
				this.x = coords[0]
				this.y = coords[1]
				this.energy++
			}
			else {
				const emptiesNearby = chooseCells(0, this.directions)
				if (emptiesNearby.length > 0) {
					const coords = emptiesNearby[Math.floor(Math.random()*emptiesNearby.length)]
					field[coords[1]][coords[0]] = 2
					field[this.y][this.x] = 0
					this.x = coords[0]
					this.y = coords[1]
				}
				this.energy--
			}
		}
	}
}

class Wolf extends Component {
	constructor (x, y) {
		super(x, y)
		this.energy = 15
		this.time = 0
	}

	action () {
		if (this.energy == 0) {
			field[this.y][this.x] = 0
			removeElement(this.x, this.y, 3)
		}
		else {
			this.directions = genDirs(this.x, this.y)
			const cowsNearby = chooseCells(2, this.directions)
			if (cowsNearby && cowsNearby.length > 0) {
				const coords = cowsNearby[Math.floor(Math.random()*cowsNearby.length)]
				removeElement(coords[0], coords[1], 2)
				field[coords[1]][coords[0]] = 3
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
					field[coords[1]][coords[0]] = 3
					field[this.y][this.x] = 1
					this.x = coords[0]
					this.y = coords[1]
				}
				else {
					const emptiesNearby = chooseCells(0, this.directions)
					if (emptiesNearby.length > 0) {
						const coords = emptiesNearby[Math.floor(Math.random()*emptiesNearby.length)]
						field[coords[1]][coords[0]] = 3
						field[this.y][this.x] = 0
						this.x = coords[0]
						this.y = coords[1]
					}
				}
				this.energy--
			}
		}
	}
}

class Bomb extends Component {
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