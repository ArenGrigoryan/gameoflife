'use strict'

module.exports = {
	genDirs: (x, y) => [ [x-1, y-1], [x, y-1], [x+1, y-1], [x-1, y], [x+1, y], [x-1, y+1], [x, y + 1], [x+1, y+1] ],
	chooseCells: (ch, dirs) => dirs.filter(dir => (dir[0] >= 0 && dir[0] < field[0].length && dir[1] >= 0 && dir[1] < field.length && field[dir[1]][dir[0]] == ch)),
	removeElement: (x,y,id) => {
		let arr = eval([, 'grasses', 'cows', 'wolves', 'bombs'][id])
		if (arr) for (let i in arr) if (arr[i].x == x && arr[i].y == y) arr.splice(i, 1)
	}
}