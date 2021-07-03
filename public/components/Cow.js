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