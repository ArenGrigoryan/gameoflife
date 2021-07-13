'use strict'
console.clear()

const fs   = require('fs'),
	  PORT = (process.argv[2] ? process.argv[2] : 3000)
const contentTypes = require('./content-types.js')

const app = require('http').createServer((req, res) => {
	const requested = ((req.url == '/' || req.url == '/index') ? '/index.html' : req.url),
		  reqParts = requested.split('.'),
		  contentType = contentTypes[reqParts[reqParts.length-1]]

	if (contentType) res.writeHead(200, {'Content-Type': contentType})
	fs.readFile('public'+requested, (e,f) => {
		res.end(e&&e.code == 'ENOENT' ? 'Error 404: could not find '+req.url + (req.url == requested ? '' : ' ('+requested+')') : f)
	})

}).listen(PORT, process.stdout.write('Server is started at http://localhost'+(PORT == 80 ? '' : ':'+PORT)+'/\n'))

// Old front-end is here...
const {genDirs, chooseCells, removeElement} = require('./components/functions.js'),
	  Grass = require('./components/Grass.js'),
	  Cow = require('./components/Cow.js'),
	  Wolf = require('./components/Wolf.js'),
	  Bomb = require('./components/Bomb.js'),
	  Human = require('./components/Human.js')

var field = [], dark = false
const grasses = [], cows = [], wolves = [], bombs = [], humans = [], FPS = 10, update = {dark: dark}

function createObjects(field) {
for (let y = 0; y < 50; y++) {
	field.push([])
	for (let x = 0; x < 50; x++) {
		const cell = Math.random()
		if (cell < 0.5) field[y].push(0)
		else if (cell < 0.92) {
			field[y].push(1)
			grasses.push(new Grass(x,y))
		}
		else if (cell < 0.96) {
			field[y].push(2)
			cows.push(new Cow(x,y))
		}
		else if (cell < 0.992) {
			field[y].push(3)
			wolves.push(new Wolf(x,y))
		}
		else if (cell < 0.996) {
			field[y].push(5)
			humans.push(new Human(x,y))
		}
		else {
			field[y].push(4)
			bombs.push(new Bomb(x,y))
		}
	}
}
}

function game () {
	if (dark) for (let w of wolves) w.action()
	else {
		for (let c of cows) c.action()
		for (let h of humans) h.action()
	}
	for (let g of grasses) g.action()

	io.sockets.emit('send field', field)
}

// IO is here...
const io = require('socket.io')(app)
io.sockets.emit('send field', field)
io.on('connection', () => {
	createObjects(field)
})

setInterval(game, 1000/FPS)